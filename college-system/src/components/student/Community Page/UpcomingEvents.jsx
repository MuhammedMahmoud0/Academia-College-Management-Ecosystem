import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getCommunityEvents } from '../../../services/communityService';
import { useAuth } from '../../../hooks/useAuth';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const GRADIENT_PAIRS = [
  ['#6366f1', '#8b5cf6'],
  ['#3b82f6', '#6366f1'],
  ['#8b5cf6', '#a855f7'],
  ['#0ea5e9', '#6366f1'],
  ['#7c3aed', '#c084fc'],
];

function parseDate(dateStr) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    return isNaN(d) ? null : d;
  } catch {
    return null;
  }
}

function formatTime12(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

function isEventPast(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export default function UpcomingEvents() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const MAX_VISIBLE = 5;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getCommunityEvents();
      setEvents(data.events || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setEvents([
        {
          id: 1,
          title: 'Coding Club Weekly Meetup',
          event_date: '2026-10-17',
          time: '18:00'
        },
        {
          id: 2,
          title: 'Guest Lecture: AI Ethics',
          event_date: '2026-10-19',
          time: '14:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };


  const sortedEvents = [...events].sort((a, b) => {
    const d1 = new Date(a.event_date);
    const d2 = new Date(b.event_date);
    return d2 - d1;
  });
  const visibleEvents = sortedEvents.slice(0, MAX_VISIBLE);

  const renderSkeleton = () => (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 items-center animate-pulse">
          <div className="w-12 h-14 rounded-xl bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-gray-200 rounded-full w-3/4" />
            <div className="h-3 bg-gray-100 rounded-full w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderEventCard = (event, index) => {
    const date = parseDate(event.event_date);
    const day = date ? date.getDate() : '?';
    const month = date ? MONTH_NAMES[date.getMonth()] : '';
    const year = date ? date.getFullYear() : '';
    const fullDate = date
      ? date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      : '';
    const time = formatTime12(event.time);
    const past = isEventPast(event.event_date);
    const [g1, g2] = GRADIENT_PAIRS[index % GRADIENT_PAIRS.length];

    return (
      <div
        key={event.id}
        className="group relative flex gap-3 items-start p-2.5 rounded-xl transition-all duration-200 hover:bg-gray-50 cursor-default"
        style={{ opacity: past ? 0.55 : 1 }}
      >
        {/* Date Badge */}
        <div
          className="w-12 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${g1}, ${g2})`,
          }}
        >
          <span className="text-white text-[10px] font-semibold uppercase leading-none tracking-wide opacity-90">
            {month}
          </span>
          <span className="text-white text-lg font-bold leading-tight">
            {day}
          </span>
        </div>

        {/* Event Info */}
        <div className="flex-1 min-w-0 py-0.5">
          <h5 className="text-sm font-semibold text-gray-900 truncate leading-tight mb-1 group-hover:text-indigo-700 transition-colors">
            {event.title}
          </h5>
          <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5">
            {fullDate && (
              <span className="text-xs font-medium text-indigo-600">
                {fullDate}
              </span>
            )}
            {time && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <AccessTimeIcon sx={{ fontSize: 13 }} />
                {time}
              </span>
            )}
            {event.location && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 truncate max-w-[120px]">
                <LocationOnIcon sx={{ fontSize: 13 }} />
                {event.location}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500" />
          <h4 className="text-base font-bold text-gray-900">
            Upcoming Events
          </h4>
          {!loading && events.length > 0 && (
            <span className="ml-1 text-[10px] font-semibold bg-indigo-50 text-indigo-600 rounded-full px-2 py-0.5">
              {events.length}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      {loading ? (
        renderSkeleton()
      ) : events.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-3xl mb-2">📅</div>
          <p className="text-sm text-gray-500">No upcoming events</p>
          <p className="text-xs text-gray-400 mt-1">Create one to get started!</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-0.5">
            {visibleEvents.map((event, idx) => renderEventCard(event, idx))}
          </div>
        </>
      )}
    </div>
  );
}