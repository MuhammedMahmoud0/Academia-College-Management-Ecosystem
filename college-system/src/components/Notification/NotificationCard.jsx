import { CheckCircle, AlertTriangle, MessageCircle, Bell } from 'lucide-react';

export default function NotificationCard({ notification, onMarkAsRead }) {
  const getIcon = () => {
    const iconProps = { className: 'w-5 h-5' };

    switch (notification.icon) {
      case 'check':
        return <CheckCircle {...iconProps} className={`${iconProps.className} text-green-600`} />;
      case 'warning':
        return <AlertTriangle {...iconProps} className={`${iconProps.className} text-yellow-600`} />;
      case 'comment':
        return <MessageCircle {...iconProps} className={`${iconProps.className} text-blue-600`} />;
      case 'bell':
        return <Bell {...iconProps} className={`${iconProps.className} text-purple-600`} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getIconBackground = () => {
    switch (notification.iconColor) {
      case 'green':
        return 'bg-green-100';
      case 'yellow':
        return 'bg-yellow-100';
      case 'blue':
        return 'bg-blue-100';
      case 'purple':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      onClick={onMarkAsRead}
      className="flex items-center gap-4 p-4 bg-white rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer shadow-sm"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-10 h-10 ${getIconBackground()} rounded-full flex items-center justify-center`}>
        {getIcon()}
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 leading-relaxed">
          {notification.message}
        </p>
        {notification.created_at && (
          <p className="text-xs text-gray-400 mt-1">
            {formatTime(notification.created_at)}
          </p>
        )}
      </div>

      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="flex-shrink-0 w-2.5 h-2.5 bg-indigo-600 rounded-full" />
      )}
    </div>
  );
}