import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { socketService } from '../services/socketService';
import {
	getNotifications as getNotificationsAPI,
	getUnreadCount as getUnreadCountAPI,
	markNotificationAsRead as markNotificationAsReadAPI,
	markAllAsRead as markAllAsReadAPI,
	deleteNotification as deleteNotificationAPI,
	deleteAllNotifications as deleteAllNotificationsAPI,
	getNotificationPreferences as getNotificationPreferencesAPI,
	updateNotificationPreferences as updateNotificationPreferencesAPI,
} from '../services/notifications';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

/**
 * Custom hook to use notification context
 * Must be used within NotificationProvider
 */
export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error('useNotification must be used within NotificationProvider');
	}
	return context;
};

/**
 * Notification Provider Component
 * Manages notification state and real-time updates
 */
export const NotificationProvider = ({ children }) => {
	const { user, isAuthenticated } = useAuth();
	const socketUserId = user?.id || user?.user_id || user?.userId || user?.uuid;

	// State
	const [notifications, setNotifications] = useState([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [preferences, setPreferences] = useState({
		new_grade: true,
		exam_deadline: true,
		community_activity: false,
		campus_announcement: true,
	});

	// Refs to prevent multiple fetches
	const fetchInProgress = useRef(false);
	const unreadCountRef = useRef(0);

	/**
	 * Fetch notifications from API
	 * @param {number} pageNum - Page number to fetch
	 * @param {number} limit - Number of notifications per page
	 * @param {boolean} append - Whether to append to existing notifications
	 * @param {boolean} silent - Whether to skip loading/error UI state updates
	 */
	const fetchNotifications = useCallback(async (pageNum = 1, limit = 20, append = false, silent = false) => {
		// Prevent multiple simultaneous fetches
		if (fetchInProgress.current) return;
		
		fetchInProgress.current = true;
		if (!silent) {
			setLoading(true);
			setError(null);
		}

		try {
			const data = await getNotificationsAPI({ page: pageNum, limit });
			
			const newNotifications = data.notifications || [];
			
			setNotifications((prev) => {
				if (append) {
					return [...prev, ...newNotifications];
				}

				if (silent && prev.length === newNotifications.length) {
					const hasChanges = prev.some((notif, index) => {
						const next = newNotifications[index];
						return (
							notif?.id !== next?.id ||
							notif?.is_read !== next?.is_read ||
							notif?.updated_at !== next?.updated_at
						);
					});

					if (!hasChanges) {
						return prev;
					}
				}

				return newNotifications;
			});
			
			// Update pagination info
			setHasMore(pageNum < (data.pagination?.totalPages || 1));
			setPage(pageNum);
			
			// Update unread count if provided
			if (data.unreadCount !== undefined) {
				setUnreadCount(data.unreadCount);
			}
			
			return data;
		} catch (err) {
			const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch notifications';
			if (!silent) {
				setError(errorMessage);
			}
			console.error('Error fetching notifications:', err);
			throw err;
		} finally {
			if (!silent) {
				setLoading(false);
			}
			fetchInProgress.current = false;
		}
	}, []);

	/**
	 * Fetch unread notification count
	 */
	const fetchUnreadCount = useCallback(async () => {
		try {
			const data = await getUnreadCountAPI();
			const nextUnreadCount = data.unreadCount || 0;
			setUnreadCount(nextUnreadCount);
			unreadCountRef.current = nextUnreadCount;
			return data;
		} catch (err) {
			console.error('Error fetching unread count:', err);
			return null;
		}
	}, []);

	/**
	 * Mark a single notification as read
	 * @param {number|string} notificationId
	 */
	const markNotificationAsRead = useCallback(async (notificationId) => {
		try {
			await markNotificationAsReadAPI(notificationId);
			
			// Update local state optimistically
			setNotifications((prev) =>
				prev.map((notif) =>
					notif.id === notificationId ? { ...notif, is_read: true } : notif
				)
			);
			
			// Update unread count
			setUnreadCount((prev) => Math.max(0, prev - 1));
			
			return true;
		} catch (err) {
			const errorMessage = err.response?.data?.error || err.message || 'Failed to mark notification as read';
			toast.error(errorMessage);
			console.error('Error marking notification as read:', err);
			return false;
		}
	}, []);

	/**
	 * Mark all notifications as read
	 */
	const markAllAsRead = useCallback(async () => {
		try {
			const data = await markAllAsReadAPI();
			
			// Update local state
			setNotifications((prev) =>
				prev.map((notif) => ({ ...notif, is_read: true }))
			);
			
			// Reset unread count
			setUnreadCount(0);
			
			toast.success('All notifications marked as read');
			return data;
		} catch (err) {
			const errorMessage = err.response?.data?.error || err.message || 'Failed to mark all as read';
			toast.error(errorMessage);
			console.error('Error marking all as read:', err);
			throw err;
		}
	}, []);

	/**
	 * Delete a single notification
	 * @param {number|string} notificationId
	 */
	const deleteNotification = useCallback(async (notificationId) => {
		try {
			await deleteNotificationAPI(notificationId);
			
			// Update local state
			setNotifications((prev) =>
				prev.filter((notif) => notif.id !== notificationId)
			);
			
			// Update unread count if it was unread
			const deletedNotif = notifications.find((n) => n.id === notificationId);
			if (deletedNotif && !deletedNotif.is_read) {
				setUnreadCount((prev) => Math.max(0, prev - 1));
			}
			
			toast.success('Notification deleted');
			return true;
		} catch (err) {
			const errorMessage = err.response?.data?.error || err.message || 'Failed to delete notification';
			toast.error(errorMessage);
			console.error('Error deleting notification:', err);
			return false;
		}
	}, [notifications]);

	/**
	 * Delete all notifications
	 */
	const deleteAllNotifications = useCallback(async () => {
		try {
			await deleteAllNotificationsAPI();
			
			// Clear local state
			setNotifications([]);
			setUnreadCount(0);
			
			toast.success('All notifications deleted');
			return true;
		} catch (err) {
			const errorMessage = err.response?.data?.error || err.message || 'Failed to delete all notifications';
			toast.error(errorMessage);
			console.error('Error deleting all notifications:', err);
			return false;
		}
	}, []);

	/**
	 * Fetch notification preferences
	 */
	const fetchPreferences = useCallback(async () => {
		try {
			const data = await getNotificationPreferencesAPI();
			if (data.preferences) {
				setPreferences(data.preferences);
			}
			return data;
		} catch (err) {
			console.error('Error fetching preferences:', err);
			return null;
		}
	}, []);

	/**
	 * Update notification preferences
	 * @param {Object} newPreferences - The preferences to update
	 */
	const updatePreferences = useCallback(async (newPreferences) => {
		try {
			const data = await updateNotificationPreferencesAPI(newPreferences);
			
			if (data.preferences) {
				setPreferences(data.preferences);
			}
			
			toast.success('Preferences saved successfully');
			return data;
		} catch (err) {
			const errorMessage = err.response?.data?.error || err.message || 'Failed to save preferences';
			toast.error(errorMessage);
			console.error('Error updating preferences:', err);
			return null;
		}
	}, []);

	/**
	 * Setup socket event listeners for real-time updates
	 */
	const setupSocketListeners = useCallback(() => {
		// Re-sync when socket reconnects after network hiccups.
		socketService.on('connect', () => {
			fetchNotifications(1, 20, false, true);
			fetchUnreadCount();
		});

		// Listen for new notifications
		socketService.on('new_notification', (data) => {
			const newNotification = data.notification || data;
			
			// Add new notification to the top of the list
			setNotifications((prev) => [newNotification, ...prev]);
			
			// Increment unread count
			setUnreadCount((prev) => prev + 1);
			
			// Show toast notification for real-time alert
			toast.custom((t) => (
				<div
					className={`${
						t.visible ? 'animate-enter' : 'animate-leave'
					} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
				>
					<div className="flex-1 w-0 p-4">
						<div className="flex items-start">
							<div className="flex-shrink-0 pt-0.5">
								<div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
									<svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
									</svg>
								</div>
							</div>
							<div className="ml-3 flex-1">
								<p className="text-sm font-medium text-gray-900">
									New Notification
								</p>
								<p className="mt-1 text-sm text-gray-500">
									{newNotification.message}
								</p>
							</div>
						</div>
					</div>
					<div className="flex border-l border-gray-200">
						<button
							onClick={() => toast.dismiss(t.id)}
							className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
						>
							Close
						</button>
					</div>
				</div>
			), { duration: 5000 });
		});

		// Listen for notification read updates (sync across devices)
		socketService.on('notification_read', (data) => {
			const notificationId = data.notificationId || data.id;
			
			setNotifications((prev) =>
				prev.map((notif) =>
					notif.id === notificationId ? { ...notif, is_read: true } : notif
				)
			);
		});

		// Listen for notification deletions (sync across devices)
		socketService.on('notification_deleted', (data) => {
			const notificationId = data.notificationId || data.id;
			
			setNotifications((prev) => {
				// Update unread count if needed
				const deletedNotif = prev.find((n) => n.id === notificationId);
				if (deletedNotif && !deletedNotif.is_read) {
					setUnreadCount((c) => Math.max(0, c - 1));
				}
				return prev.filter((notif) => notif.id !== notificationId);
			});
		});
	}, [fetchNotifications, fetchUnreadCount]);

	/**
	 * Connect to socket when authenticated
	 */
	useEffect(() => {
		if (isAuthenticated && socketUserId) {
			// Connect to socket
			socketService.connect(socketUserId);
			
			// Setup listeners
			setupSocketListeners();
			
			// Initial data fetch
			fetchNotifications(1);
			fetchUnreadCount();
			fetchPreferences();
		}

		// Cleanup on unmount or logout
		return () => {
			socketService.disconnect();
		};
	}, [isAuthenticated, socketUserId, setupSocketListeners, fetchNotifications, fetchUnreadCount, fetchPreferences]);

	// Fallback sync: only refresh list when unread count actually changes.
	useEffect(() => {
		if (!isAuthenticated || !socketUserId) return;

		const intervalId = setInterval(async () => {
			if (document.hidden) return;

			try {
				const data = await getUnreadCountAPI();
				const nextUnreadCount = data.unreadCount || 0;
				const previousUnreadCount = unreadCountRef.current;

				if (nextUnreadCount !== previousUnreadCount) {
					setUnreadCount(nextUnreadCount);
					unreadCountRef.current = nextUnreadCount;

					if (nextUnreadCount > previousUnreadCount) {
						fetchNotifications(1, 20, false, true);
					}
				}
			} catch (err) {
				console.error('Error syncing unread count:', err);
			}
		}, 10000);

		return () => clearInterval(intervalId);
	}, [isAuthenticated, socketUserId, fetchNotifications]);

	/**
	 * Refresh notifications (useful after mutations)
	 */
	const refresh = useCallback(() => {
		fetchNotifications(1, 20, false);
		fetchUnreadCount();
	}, [fetchNotifications, fetchUnreadCount]);

	const showNotification = useCallback((message, type = 'success') => {
		const handlers = {
			success: toast.success,
			error: toast.error,
			warning: toast,
			info: toast,
		};

		const notify = handlers[type] || toast;
		notify(message);
	}, []);

	const value = {
		// State
		notifications,
		unreadCount,
		loading,
		error,
		hasMore,
		page,
		preferences,
		
		// Actions
		fetchNotifications,
		fetchUnreadCount,
		markNotificationAsRead,
		markAllAsRead,
		deleteNotification,
		deleteAllNotifications,
		fetchPreferences,
		updatePreferences,
		refresh,
		showNotification,
	};

	return (
		<NotificationContext.Provider value={value}>
			{children}
		</NotificationContext.Provider>
	);
};

export default NotificationProvider;
