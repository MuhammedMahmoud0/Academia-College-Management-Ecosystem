import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';
import Avatar from '@mui/material/Avatar';
import { Bell } from 'lucide-react';

export default function Header({ onMenuToggle }) {
    const { user } = useAuth();
    const { unreadCount, notifications, markNotificationAsRead } = useNotification();
    const navigate = useNavigate();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const notificationRef = useRef(null);

    // Close notifications dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notification) => {
        if (!notification.is_read) {
            await markNotificationAsRead(notification.id);
        }
        // Optionally navigate to related content based on notification type
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        
        return date.toLocaleDateString();
    };

    return (
        <header className="bg-white border-b border-gray-200 h-16 fixed top-0 left-0 right-0 z-50">
            <div className="h-full px-4 md:px-6 flex items-center justify-between">
                {/* Left side - Logo and Menu Button */}
                <div className="flex items-center gap-4">
                    {/* Menu Toggle Button */}
                    <button 
                        onClick={onMenuToggle}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="text-gray-600"
                        >
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#4f46e5"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                        <span className="text-xl font-bold text-slate-900">Academia</span>
                    </div>
                </div>

                {/* Right side - User Profile */}
                <div className="flex items-center gap-3">
                    {/* Notification Bell */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative flex items-center justify-center text-gray-600 focus:outline-none"
                            aria-label="View notifications"
                        >
                            <Bell className="h-6 w-6" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-red-600 rounded-full border-2 border-white px-1">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Dropdown Menu */}
                        {isNotificationOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 overflow-hidden transform origin-top-right transition-all">
                                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center rounded-t-lg bg-gray-50/50">
                                    <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <span className="text-xs font-medium text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">{unreadCount} New</span>
                                    )}
                                </div>

                                <div className="max-h-[340px] overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.slice(0, 5).map((notification) => (
                                            <div
                                                key={notification.id}
                                                onClick={() => handleNotificationClick(notification)}
                                                className={`px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer ${
                                                    !notification.is_read ? 'bg-indigo-50/30' : ''
                                                }`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                                                        !notification.is_read ? 'bg-indigo-600' : 'bg-transparent'
                                                    }`} />
                                                    <div className="flex-1">
                                                        <p className={`text-sm ${
                                                            !notification.is_read ? 'font-medium text-gray-900' : 'text-gray-600'
                                                        }`}>
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {formatTime(notification.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-6 text-center text-sm text-gray-500">
                                            No recent notifications
                                        </div>
                                    )}
                                </div>

                                <div className="p-2 border-t border-gray-100 bg-white">
                                    <button
                                        onClick={() => {
                                            setIsNotificationOpen(false);
                                            navigate('/dashboard/notifications');
                                        }}
                                        className="w-full text-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 py-2 rounded-md transition-colors"
                                    >
                                        Show All Notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-semibold text-slate-900">
                            {user?.full_name || "Guest User"}
                        </span>
                    </div>
                    <Avatar 
                        src={user?.avatar_url || ''} 
                        alt={user?.full_name || "User Avatar"}
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: user?.avatar_url ? undefined : '#4f46e5',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                        }}
                    >
                        {!user?.avatar_url && user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
