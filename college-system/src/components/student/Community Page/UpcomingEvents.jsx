import { useState, useEffect } from 'react';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AddIcon from '@mui/icons-material/Add';
import EventModal from './EventModal';
import { createCommunityEvent, getCommunityEvents } from '../../../services/communityService';

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [createEventError, setCreateEventError] = useState('');

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

  const handleOpenCreateEventModal = () => {
    setCreateEventError('');
    setShowCreateEventModal(true);
  };

  const handleCloseCreateEventModal = () => {
    if (!isCreatingEvent) {
      setShowCreateEventModal(false);
      setCreateEventError('');
    }
  };

  const handleCreateEvent = async (payload) => {
    try {
      setIsCreatingEvent(true);
      setCreateEventError('');

      await createCommunityEvent(payload);
      setShowCreateEventModal(false);
      await fetchEvents();
    } catch (err) {
      console.error('Error creating event:', err);

      if (err?.response?.status === 401) {
        setCreateEventError('Your session expired. Please login again.');
      } else if (err?.response?.status === 403) {
        setCreateEventError('Only admin or super admin can create events.');
      } else if (err?.response?.status >= 500) {
        setCreateEventError('Server error while creating event. Please try again shortly.');
      } else {
        const apiMessage =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.response?.data?.details;
        setCreateEventError(apiMessage || 'Failed to create event. Please try again.');
      }
    } finally {
      setIsCreatingEvent(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h4 className="text-base font-semibold text-gray-900">
            Upcoming Events
          </h4>
          <button
            onClick={handleOpenCreateEventModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <AddIcon sx={{ fontSize: 16 }} />
            Create Event
          </button>
        </div>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>

        <EventModal
          isOpen={showCreateEventModal}
          onClose={handleCloseCreateEventModal}
          onSubmit={handleCreateEvent}
          mode="create"
          isSubmitting={isCreatingEvent}
          submitError={createEventError}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h4 className="text-base font-semibold text-gray-900">
          Upcoming Events
        </h4>
        <button
          onClick={handleOpenCreateEventModal}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <AddIcon sx={{ fontSize: 16 }} />
          Create Event
        </button>
      </div>
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

      <EventModal
        isOpen={showCreateEventModal}
        onClose={handleCloseCreateEventModal}
        onSubmit={handleCreateEvent}
        mode="create"
        isSubmitting={isCreatingEvent}
        submitError={createEventError}
      />
    </div>
  );
}