import { useState, useEffect } from 'react';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { getCommunityEvents } from '../../../services/communityService';

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
      // Fallback to mock data on error
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

  const formatEventDate = (dateStr, timeStr) => {
    if (!dateStr) return 'Date TBD';
    
    try {
      const date = new Date(dateStr);
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const day = date.getDate();
      
      if (timeStr) {
        // Format time from 24h to 12h format
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${month} ${day}, ${hour12}:${minutes} ${ampm}`;
      }
      
      return `${month} ${day}`;
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
        <h4 className="text-base font-semibold mb-4 text-gray-900">
          Upcoming Events
        </h4>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
      <h4 className="text-base font-semibold mb-4 text-gray-900">
        Upcoming Events
      </h4>
      {events.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <div key={event.id} className="flex gap-3 items-start">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                <DateRangeIcon className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  {event.title}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {formatEventDate(event.event_date, event.time)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}