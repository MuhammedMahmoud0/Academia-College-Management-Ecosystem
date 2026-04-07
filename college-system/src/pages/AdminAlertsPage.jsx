import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, AlertTriangle, AlertCircle, Info,
  ChevronRight, Loader, ShieldAlert
} from 'lucide-react';
import { getAdminAlerts } from '../services/adminDashboard';

const PRIORITY_CONFIG = {
  high: {
    label: 'High',
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700',
    icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
    bar: 'border-l-red-500',
  },
  medium: {
    label: 'Medium',
    dot: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-700',
    icon: <AlertCircle className="w-4 h-4 text-orange-500" />,
    bar: 'border-l-orange-500',
  },
  low: {
    label: 'Low',
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700',
    icon: <Info className="w-4 h-4 text-blue-500" />,
    bar: 'border-l-blue-500',
  },
};

const getPriorityConfig = (priority) =>
  PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;

const FILTERS = ['All', 'High', 'Medium', 'Low'];

const POLL_INTERVAL = 30_000; // 30 seconds

export default function AdminAlertsPage() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAlerts = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await getAdminAlerts();
      setAlerts(res.data || []);
      setLastUpdated(new Date());
    } catch {
      // silently keep existing data on poll failures
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  // Initial fetch + auto-poll every 30 s
  useEffect(() => {
    fetchAlerts(true);
    const timer = setInterval(() => fetchAlerts(false), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchAlerts]);

  const filtered = activeFilter === 'All'
    ? alerts
    : alerts.filter(a => (a.priority || '').toLowerCase() === activeFilter.toLowerCase());

  const countFor = (f) => f === 'All'
    ? alerts.length
    : alerts.filter(a => (a.priority || '').toLowerCase() === f.toLowerCase()).length;

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
              <ShieldAlert className="w-6 h-6 text-indigo-600" />
              Needs Attention
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {alerts.length} active system alert{alerts.length !== 1 ? 's' : ''}
              {lastUpdated && (
                <span className="ml-2 text-xs text-gray-400">
                  · Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Priority Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map(f => {
          const count = countFor(f);
          const isActive = activeFilter === f;
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
          <p className="text-sm text-gray-500">Loading alerts...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
          <ShieldAlert className="w-12 h-12" />
          <p className="text-base font-medium">No {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} alerts found</p>
          <p className="text-sm">The system looks healthy right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((alert, i) => {
            const cfg = getPriorityConfig(alert.priority);
            return (
              <div
                key={i}
                className={`bg-white rounded-xl shadow-sm border-l-4 ${cfg.bar} px-5 py-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer group`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex-shrink-0">{cfg.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed">
                      {alert.message}
                    </p>
                    {alert.link && (
                      <p className="text-xs text-indigo-500 mt-1">{alert.link}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
