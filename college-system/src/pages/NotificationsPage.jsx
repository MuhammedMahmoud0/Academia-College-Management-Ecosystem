import { useState } from 'react';
import NotificationCard from '../components/Notification/NotificationCard';
import { CheckCircle, AlertTriangle, MessageCircle, Bell, Settings } from 'lucide-react';

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'grade',
      icon: 'check',
      iconColor: 'green',
      message: 'Your grade for CS462: Machine Learning has been posted.',
      time: 'YESTERDAY',
      isRead: false
    },
    {
      id: 2,
      type: 'deadline',
      icon: 'warning',
      iconColor: 'yellow',
      message: 'Assignment "Phase 2 Report" for CS421 is due tomorrow.',
      time: 'THIS WEEK',
      isRead: false
    },
    {
      id: 3,
      type: 'community',
      icon: 'comment',
      iconColor: 'blue',
      message: 'Sarah Johnson replied to your post in the Community Hub.',
      time: 'THIS WEEK',
      isRead: false
    },
    {
      id: 4,
      type: 'announcement',
      icon: 'bell',
      iconColor: 'purple',
      message: 'The library will be closed this weekend for system upgrades.',
      time: 'THIS WEEK',
      isRead: true
    },
    {
      id: 5,
      type: 'grade',
      icon: 'check',
      iconColor: 'green',
      message: 'Your grade for EE320: Embedded Systems has been posted.',
      time: 'OLDER',
      isRead: true
    }
  ]);

  const filters = [
    { name: 'All', count: null },
    { name: 'Unread', count: 3 },
    { name: 'Grade', count: null },
    { name: 'Deadline', count: null },
    { name: 'Community', count: null },
    { name: 'Announcement', count: null }
  ];

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const getFilteredNotifications = () => {
    if (activeFilter === 'All') return notifications;
    if (activeFilter === 'Unread') return notifications.filter(n => !n.isRead);
    return notifications.filter(n => n.type.toLowerCase() === activeFilter.toLowerCase());
  };

  const groupByTime = (notifs) => {
    const groups = {
      'YESTERDAY': [],
      'THIS WEEK': [],
      'OLDER': []
    };
    
    notifs.forEach(notif => {
      if (groups[notif.time]) {
        groups[notif.time].push(notif);
      }
    });
    
    return groups;
  };

  const filteredNotifications = getFilteredNotifications();
  const groupedNotifications = groupByTime(filteredNotifications);

  return (
    <div className="w-full min-h-screen bg-gray-50 rounded-lg">
      <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Notifications
          </h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={markAllAsRead}
              className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors whitespace-nowrap"
            >
              Mark all as read
            </button>
            <button className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-lg transition-colors">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </div>
        </div>

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
                {filter.count && (
                  <span className="bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {filter.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([timeGroup, notifs]) => (
            notifs.length > 0 && (
              <div key={timeGroup}>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {timeGroup}
                </h2>
                <div className="space-y-3">
                  {notifs.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={() => markAsRead(notification.id)}
                    />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No notifications found.
          </div>
        )}
      </div>
    </div>
  );
}