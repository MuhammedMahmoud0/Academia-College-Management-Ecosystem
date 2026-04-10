import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, AlertTriangle, AlertCircle, Info,
  ChevronRight, Loader, ShieldAlert
} from 'lucide-react';
import { getDoctorAlerts, getTAAlerts } from '../services/doctorDashboard';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const ALERT_CONFIG = {
  ungraded_submissions: {
    label: 'Grading',
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700',
    icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
    bar: 'border-l-red-500',
  },
  expired_task: {
    label: 'Expired',
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700',
    icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
    bar: 'border-l-red-500',
  },
  low_score_counts: {
    label: 'Low Scores',
    dot: 'bg-yellow-500',
    badge: 'bg-yellow-100 text-yellow-700',
    icon: <AlertCircle className="w-4 h-4 text-yellow-500" />,
    bar: 'border-l-yellow-500',
  },
  active_task: {
    label: 'Active',
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700',
    icon: <Info className="w-4 h-4 text-blue-500" />,
    bar: 'border-l-blue-500',
  },
  default: {
    label: 'Notice',
    dot: 'bg-gray-500',
    badge: 'bg-gray-100 text-gray-700',
    icon: <Info className="w-4 h-4 text-gray-500" />,
    bar: 'border-l-gray-500',
  }
};

const getConfig = (type) => ALERT_CONFIG[type] || ALERT_CONFIG.default;

const POLL_INTERVAL = 30_000; // 30 seconds

export default function DoctorAlertsPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAlerts = useCallback(async (isInitial = false) => {
    if (!user) return; // Wait for user context
    if (isInitial) setLoading(true);
    try {
      const isTA = user.role === 'teaching_assistant';
      const res = await (isTA ? getTAAlerts() : getDoctorAlerts());
      setAlerts(res.alerts || []);
      setLastUpdated(new Date());
    } catch {
      // silently keep existing data on poll failures
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  // Initial fetch + auto-poll every 30 s
  useEffect(() => {
    if (!user) return;
    fetchAlerts(true);
    const timer = setInterval(() => fetchAlerts(false), POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchAlerts, user]);

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

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
          <ShieldAlert className="w-12 h-12" />
          <p className="text-base font-medium">No alerts found</p>
          <p className="text-sm">Everything is caught up.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, i) => {
            const cfg = getConfig(alert.type);
            return (
              <div
                key={i}
                className={`bg-white rounded-xl shadow-sm border-l-4 ${cfg.bar} px-5 py-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-default group`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex-shrink-0">{cfg.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 leading-relaxed">
                      {alert.label}
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
