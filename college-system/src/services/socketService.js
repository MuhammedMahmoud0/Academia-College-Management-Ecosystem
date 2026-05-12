import { io } from 'socket.io-client';
import { getAccessToken } from './apiClient';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://college-system-backend.onrender.com';

/**
 * Socket.io Service for real-time notifications
 * Manages WebSocket connection and event listeners
 */
class SocketService {
	constructor() {
		this.socket = null;
		this.listeners = new Map();
	}

	/**
	 * Connect to the Socket.io server
	 * @param {string} userId - The authenticated user's ID
	 */
	connect(userId) {
		if (!userId) {
			console.warn('Socket connect skipped: missing userId');
			return;
		}

		// If an existing socket is already connected or currently trying to reconnect,
		// avoid creating a second concurrent connection.
		if (this.socket?.connected || this.socket?.active) {
			console.log('Socket already connected/connecting');
			return;
		}

		const token = getAccessToken();

		if (this.socket) {
			this.socket.auth = { token };
			this.socket.io.opts.query = { userId };
			this.socket.connect();
			return;
		}

		this.socket = io(SOCKET_URL, {
			auth: {
				token: token,
			},
			query: {
				userId: userId,
			},
			// Start with polling to reduce websocket handshake failures on some networks/proxies.
			transports: ['polling', 'websocket'],
			autoConnect: false,
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
		});

		// Connection events
		this.socket.on('connect', () => {
			console.log('✅ Socket connected:', this.socket.id);
			// Try common room-join contracts used by different backend implementations.
			this.socket.emit('join_notifications', { userId });
			this.socket.emit('join_user_room', { userId });
			this.socket.emit('join', { userId });
			this.notifyListeners('connect', { socketId: this.socket.id, userId });
		});

		this.socket.on('disconnect', (reason) => {
			console.log('❌ Socket disconnected:', reason);
			this.notifyListeners('disconnect', { reason });
		});

		this.socket.on('connect_error', (error) => {
			console.error('Socket connection error:', error.message);
			this.notifyListeners('connect_error', { message: error.message });
		});

		// Setup notification event listeners
		this.setupNotificationListeners();
		this.socket.connect();
	}

	/**
	 * Disconnect from the Socket.io server
	 */
	disconnect() {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
			this.listeners.clear();
			console.log('Socket disconnected');
		}
	}

	/**
	 * Setup real-time notification event listeners
	 */
	setupNotificationListeners() {
		const handleNewNotification = (data) => {
			console.log('📬 New notification received:', data);
			this.notifyListeners('new_notification', data);
		};

		// Listen to common event aliases from different backend implementations.
		[
			'new_notification',
			'notification_created',
			'newNotification',
			'notification:new',
		].forEach((eventName) => {
			this.socket.on(eventName, handleNewNotification);
		});

		// Notification marked as read (sync across devices)
		const handleNotificationRead = (data) => {
			console.log('✅ Notification marked as read:', data);
			this.notifyListeners('notification_read', data);
		};

		['notification_read', 'notification:read', 'notificationRead'].forEach((eventName) => {
			this.socket.on(eventName, handleNotificationRead);
		});

		// Notification deleted (sync across devices)
		const handleNotificationDeleted = (data) => {
			console.log('🗑️ Notification deleted:', data);
			this.notifyListeners('notification_deleted', data);
		};

		['notification_deleted', 'notification:deleted', 'notificationDeleted'].forEach((eventName) => {
			this.socket.on(eventName, handleNotificationDeleted);
		});
	}

	/**
	 * Register an event listener
	 * @param {string} event - Event name
	 * @param {Function} callback - Callback function
	 */
	on(event, callback) {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, []);
		}
		this.listeners.get(event).push(callback);
	}

	/**
	 * Remove an event listener
	 * @param {string} event - Event name
	 * @param {Function} callback - Callback function to remove
	 */
	off(event, callback) {
		if (!this.listeners.has(event)) return;
		
		const callbacks = this.listeners.get(event);
		const index = callbacks.indexOf(callback);
		
		if (index !== -1) {
			callbacks.splice(index, 1);
		}
	}

	/**
	 * Notify all listeners for a specific event
	 * @param {string} event - Event name
	 * @param {any} data - Event data
	 */
	notifyListeners(event, data) {
		if (!this.listeners.has(event)) return;

		this.listeners.get(event).forEach((callback) => {
			try {
				callback(data);
			} catch (error) {
				console.error(`Error in notification listener (${event}):`, error);
			}
		});
	}

	/**
	 * Check if socket is connected
	 * @returns {boolean}
	 */
	isConnected() {
		return this.socket?.connected || false;
	}

	/**
	 * Get socket instance
	 * @returns {Socket|null}
	 */
	getSocket() {
		return this.socket;
	}
}

// Singleton instance
export const socketService = new SocketService();
export default socketService;
