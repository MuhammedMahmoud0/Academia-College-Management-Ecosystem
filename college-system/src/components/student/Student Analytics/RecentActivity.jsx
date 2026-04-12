const getNotificationStyle = (type = '') => {
  const normalized = String(type).toLowerCase();

  if (normalized.includes('grade')) return { icon: '📘', iconBg: '#DBEAFE' };
  if (normalized.includes('deadline')) return { icon: '⏰', iconBg: '#FEF3C7' };
  if (normalized.includes('community')) return { icon: '💬', iconBg: '#E0E7FF' };
  if (normalized.includes('announcement')) return { icon: '📣', iconBg: '#FEE2E2' };

  return { icon: '🔔', iconBg: '#E5E7EB' };
};

const formatRelativeTime = (dateValue) => {
  if (!dateValue) return 'Unknown time';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Unknown time';

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const withPlural = (value, unit) => `${value} ${unit}${value === 1 ? '' : 's'} ago`;

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return withPlural(Math.floor(seconds / 60), 'min');
  if (seconds < 86400) return withPlural(Math.floor(seconds / 3600), 'hr');
  if (seconds < 604800) return withPlural(Math.floor(seconds / 86400), 'day');
  return withPlural(Math.floor(seconds / 604800), 'week');
};

export default function RecentActivity({ activities = [], loading = false }) {
  const visibleActivities = activities.slice(0, 5);

  return (
    <div className="w-full h-[320px] flex flex-col">
      <h2 className="mb-4 text-lg sm:text-xl font-bold text-slate-900">Recent Activity</h2>

      <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
        {loading ? (
          <div className="rounded-xl border border-dashed border-slate-200 h-full flex items-center justify-center text-slate-500 text-sm">
            Loading recent activity...
          </div>
        ) : visibleActivities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 h-full flex items-center justify-center text-slate-500 text-sm">
            No recent notifications.
          </div>
        ) : (
          visibleActivities.map((activity) => {
            const style = getNotificationStyle(activity?.type);

            return (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/40 transition-colors"
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                backgroundColor: style.iconBg,
                borderRadius: '8px',
                fontSize: '18px',
                flexShrink: 0,
              }}
            >
              {style.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="m-0 mb-1 text-slate-800 text-sm sm:text-[15px] font-semibold leading-snug">
                {activity.message || 'Notification'}
              </h3>
              <p className="m-0 text-slate-400 text-xs sm:text-sm">{formatRelativeTime(activity.created_at)}</p>
            </div>
          </div>
            );
          })
        )}
      </div>
    </div>
  );
}
