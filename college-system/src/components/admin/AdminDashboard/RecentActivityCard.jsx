import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Activity, UserPlus, Megaphone, BookOpen, ClipboardList, ArrowUpRight } from 'lucide-react';

const PREVIEW_COUNT = 5;

const activityIcon = (type) => {
  switch (type) {
    case 'user_registered':
      return <UserPlus className="w-4 h-4 text-indigo-500" />;
    case 'announcement':
      return <Megaphone className="w-4 h-4 text-orange-500" />;
    case 'community_post':
      return <BookOpen className="w-4 h-4 text-green-500" />;
    case 'task_submission':
      return <ClipboardList className="w-4 h-4 text-blue-500" />;
    default:
      return <Activity className="w-4 h-4 text-gray-400" />;
  }
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp.replace(' ', 'T'));
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  } catch {
    return timestamp;
  }
};

const RecentActivityCard = ({ activities, loading }) => {
  const navigate = useNavigate();

  const visibleItems = activities ? activities.slice(0, PREVIEW_COUNT) : [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        {!loading && (
          <button
            onClick={() => navigate('/dashboard/admin/activity')}
            title="View all activity"
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 text-indigo-500 animate-spin" />
        </div>
      ) : !activities || activities.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
          No recent activity.
        </div>
      ) : (
        <div className="space-y-4">
          {visibleItems.map((activity, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                {activityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {activity.time || formatTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivityCard;
