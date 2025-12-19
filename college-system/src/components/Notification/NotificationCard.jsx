import { CheckCircle, AlertTriangle, MessageCircle, Bell } from 'lucide-react';

export default function NotificationCard({ notification, onMarkAsRead }) {
  const getIcon = () => {
    const iconProps = { className: 'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6' };
    
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

  return (
    <div
      onClick={onMarkAsRead}
      className="flex items-start sm:items-center gap-2.5 sm:gap-3 md:gap-4 p-3 sm:p-4 md:p-5 bg-white rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer group shadow-sm"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 ${getIconBackground()} rounded-full flex items-center justify-center`}>
        {getIcon()}
      </div>

      {/* Message */}
      <p className="flex-1 text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed min-w-0">
        {notification.message}
      </p>

      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="flex-shrink-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-indigo-600 rounded-full mt-1 sm:mt-0" />
      )}
    </div>
  );
}