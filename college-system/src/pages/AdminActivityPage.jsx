import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Activity, UserPlus, Megaphone, BookOpen,
  ClipboardList, Loader, Clock
} from 'lucide-react';
import { getAdminActivity } from '../services/adminDashboard';

const TYPE_CONFIG = {
  user_registered: {
    label: 'Registration',
    icon: <UserPlus className="w-4 h-4 text-indigo-500" />,
    bg: 'bg-indigo-50',
    badge: 'bg-indigo-100 text-indigo-700',
  },
  announcement: {
    label: 'Announcement',
    icon: <Megaphone className="w-4 h-4 text-orange-500" />,
    bg: 'bg-orange-50',
    badge: 'bg-orange-100 text-orange-700',
  },
  community_post: {
    label: 'Community',
    icon: <BookOpen className="w-4 h-4 text-green-500" />,
    bg: 'bg-green-50',
    badge: 'bg-green-100 text-green-700',
  },
  task_submission: {
    label: 'Submission',
    icon: <ClipboardList className="w-4 h-4 text-blue-500" />,
    bg: 'bg-blue-50',
    badge: 'bg-blue-100 text-blue-700',
  },
};

const getTypeConfig = (type) =>
  TYPE_CONFIG[type] || {
    label: 'Activity',
    icon: <Activity className="w-4 h-4 text-gray-400" />,
    bg: 'bg-gray-50',
    badge: 'bg-gray-100 text-gray-600',
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

const formatFullDate = (timestamp) => {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp.replace(' ', 'T'));
    return date.toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return timestamp;
  }
};

const LIMIT_OPTIONS = [10, 25, 50];
const TYPE_FILTERS = ['All', 'Registration', 'Announcement', 'Community', 'Submission'];

const TYPE_KEY_MAP = {
  'Registration': 'user_registered',
  'Announcement': 'announcement',
  'Community': 'community_post',
  'Submission': 'task_submission',
};

const POLL_INTERVAL = 30_000; // 30 seconds

export default function AdminActivityPage() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [limit, setLimit] = useState(25);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchActivity = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await getAdminActivity(limit);
      setActivities(res.data || []);
      setLastUpdated(new Date());
    } catch {
      // silently keep existing data on poll failures
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [limit]);

  // Initial fetch + auto-poll every 30 s (resets when limit changes)
  useEffect(() => {
    fetchActivity(true);
    const timer = setInterval(() => fetchActivity(false), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchActivity]);

  const filtered = activeFilter === 'All'
    ? activities
    : activities.filter(a => a.type === TYPE_KEY_MAP[activeFilter]);

  const countFor = (f) => f === 'All'
    ? activities.length
    : activities.filter(a => a.type === TYPE_KEY_MAP[f]).length;

  return (
    <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 min-h-screen rounded-xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200 hover:shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-indigo-600" />
              Recent Activity
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Showing {filtered.length} of {activities.length} events
              {lastUpdated && (
                <span className="ml-2 text-xs text-gray-400">
                  · Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Limit selector */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
          <span className="text-xs text-gray-500">Show</span>
          {LIMIT_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => setLimit(opt)}
              className={`text-xs font-medium px-2 py-0.5 rounded transition-colors ${
                limit === opt
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TYPE_FILTERS.map(f => {
          const count = countFor(f);
          const isActive = activeFilter === f;
          const cfg = f !== 'All' ? getTypeConfig(TYPE_KEY_MAP[f]) : null;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cfg && <span className={isActive ? 'opacity-80' : ''}>{cfg.icon}</span>}
              {f}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading activity feed...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
          <Activity className="w-12 h-12" />
          <p className="text-base font-medium">No activity found</p>
          <p className="text-sm">Try changing the filter or increasing the limit.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
          {filtered.map((activity, i) => {
            const cfg = getTypeConfig(activity.type);
            return (
              <div
                key={i}
                className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
              >
                {/* Icon */}
                <div className={`w-9 h-9 ${cfg.bg} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  {cfg.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {activity.time || formatTime(activity.timestamp)}
                    </span>
                    {activity.timestamp && (
                      <span className="text-xs text-gray-300">
                        · {formatFullDate(activity.timestamp)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Badge */}
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${cfg.badge}`}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
