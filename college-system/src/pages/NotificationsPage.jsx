import { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';
import NotificationCard from '../components/Notification/NotificationCard';
import SendNotificationModal from '../components/Notification/SendNotificationModal';
import {
  createBulkNotifications,
  createNotification,
  getUsersList,
} from '../services/notifications';
import { Bell, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [usersForNotification, setUsersForNotification] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    fetchNotifications,
    markNotificationAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotification();

  const [page, setPage] = useState(1);

  const normalizedRole = useMemo(
    () => String(user?.role || user?.user_role || user?.userType || user?.type || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_'),
    [user]
  );
  const isAdminUser = normalizedRole === 'admin' || normalizedRole === 'super_admin';

  const filters = [
    { name: 'All', type: null },
    { name: 'Unread', type: 'unread' },
    { name: 'Grade', type: 'new_grade' },
    { name: 'Deadline', type: 'exam_deadline' },
    { name: 'Community', type: 'community_activity' },
    { name: 'Announcement', type: 'campus_announcement' }
  ];

  // Load more notifications
  const loadMore = () => {
    const nextPage = page + 1;
    fetchNotifications(nextPage, 20, true);
    setPage(nextPage);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
    } catch {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleDeleteNotification = async (id) => {
    const success = await deleteNotification(id);
    if (!success) {
      toast.error('Failed to delete notification');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete all notifications?')) return;
    
    const success = await deleteAllNotifications();
    if (!success) {
      toast.error('Failed to delete all notifications');
    }
  };

  const loadUsersForNotification = async () => {
    setLoadingUsers(true);
    try {
      const data = await getUsersList();
      const users = data?.users || data?.data?.users || data?.data || [];
      setUsersForNotification(Array.isArray(users) ? users : []);
    } catch (error) {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to load users list';
      toast.error(errorMessage);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleOpenSendNotificationModal = async () => {
    if (!isAdminUser) return;

    setIsSendModalOpen(true);

    if (usersForNotification.length === 0) {
      await loadUsersForNotification();
    }
  };

  const handleSubmitNotification = async ({ userIds, message, type }) => {
    setSendingNotification(true);
    try {
      if (userIds.length === 1) {
        await createNotification({
          user_id: userIds[0],
          message,
          type,
        });
      } else {
        await createBulkNotifications({
          user_ids: userIds,
          message,
          type,
        });
      }

      toast.success('Notification sent successfully');
      setIsSendModalOpen(false);
    } catch (error) {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to send notification';
      toast.error(errorMessage);
    } finally {
      setSendingNotification(false);
    }
  };

  const getFilteredNotifications = () => {
    const selectedFilter = filters.find((filter) => filter.name === activeFilter);
    const selectedType = selectedFilter?.type;

    if (!selectedType) return notifications;
    if (selectedType === 'unread') return notifications.filter((notification) => !notification.is_read);

    const typeAliases = {
      new_grade: ['new_grade', 'grade'],
      exam_deadline: ['exam_deadline', 'deadline'],
      community_activity: ['community_activity', 'community'],
      campus_announcement: ['campus_announcement', 'announcement', 'welcome'],
    };

    const allowedTypes = typeAliases[selectedType] || [selectedType];

    return notifications.filter((notification) => {
      const normalizedType = String(notification?.type || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');
      return allowedTypes.includes(normalizedType);
    });
  };

  const groupByTime = (notifs) => {
    const now = new Date();
    const groups = {};

    const sortedNotifs = [...notifs].sort((a, b) => {
      const aTime = new Date(a.created_at || 0).getTime();
      const bTime = new Date(b.created_at || 0).getTime();
      return bTime - aTime;
    });

    sortedNotifs.forEach(notif => {
      const notifDate = new Date(notif.created_at);
      const diffDays = Math.floor((now - notifDate) / (1000 * 60 * 60 * 24));
      
      let timeGroup;
      // Future/offset timestamps should still be considered "today" for UX consistency.
      if (diffDays <= 0) {
        timeGroup = 'TODAY';
      } else if (diffDays === 1) {
        timeGroup = 'YESTERDAY';
      } else if (diffDays < 7) {
        timeGroup = 'THIS WEEK';
      } else {
        timeGroup = 'OLDER';
      }
      
      if (!groups[timeGroup]) {
        groups[timeGroup] = [];
      }
      groups[timeGroup].push(notif);
    });

    // Maintain order
    const orderedGroups = {};
    ['TODAY', 'YESTERDAY', 'THIS WEEK', 'OLDER'].forEach(key => {
      if (groups[key]) orderedGroups[key] = groups[key];
    });

    return orderedGroups;
  };

  const getIconForType = (type) => {
    const iconMap = {
      'new_grade': { icon: 'check', color: 'green' },
      'exam_deadline': { icon: 'warning', color: 'yellow' },
      'community_activity': { icon: 'comment', color: 'blue' },
      'campus_announcement': { icon: 'bell', color: 'purple' }
    };
    return iconMap[type] || { icon: 'bell', color: 'gray' };
  };

  const filteredNotifications = getFilteredNotifications();
  const groupedNotifications = groupByTime(filteredNotifications);

  return (
    <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-3 text-lg font-normal text-indigo-600">
              ({unreadCount} unread)
            </span>
          )}
        </h1>
        <div className="flex items-center gap-2 sm:gap-4">
          {isAdminUser && (
            <button
              onClick={handleOpenSendNotificationModal}
              className="px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
            >
              Send Notification
            </button>
          )}
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark all as read
          </button>
          <button
            onClick={handleDeleteAll}
            className="p-1.5 sm:p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            title="Delete all notifications"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && notifications.length === 0 && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
          <button
            onClick={() => fetchNotifications(1)}
            className="ml-4 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter.name}
              onClick={() => setActiveFilter(filter.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                activeFilter === filter.name
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  : 'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200'
              }`}
            >
              {filter.name}
              {filter.type === 'unread' && unreadCount > 0 && (
                <span className="bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {!loading && (
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([timeGroup, notifs]) => (
            notifs.length > 0 && (
              <div key={timeGroup}>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {timeGroup}
                </h2>
                <div className="space-y-3">
                  {notifs.map((notification) => {
                    const { icon, color } = getIconForType(notification.type);
                    return (
                      <div key={notification.id} className="relative group">
                        <NotificationCard
                          notification={{
                            ...notification,
                            icon,
                            iconColor: color,
                            isRead: notification.is_read,
                          }}
                          onMarkAsRead={() => handleMarkAsRead(notification.id)}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                          className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded transition-opacity"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && filteredNotifications.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Load More
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredNotifications.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No notifications found</p>
          <p className="text-sm mt-2">
            {activeFilter === 'All' 
              ? "You're all caught up!" 
              : `No ${activeFilter.toLowerCase()} notifications`}
          </p>
        </div>
      )}

      <SendNotificationModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onSubmit={handleSubmitNotification}
        users={usersForNotification}
        loadingUsers={loadingUsers}
        isSubmitting={sendingNotification}
      />
    </div>
  );
}