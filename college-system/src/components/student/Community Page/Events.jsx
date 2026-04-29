import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem, IconButton } from '@mui/material';
import ProfileCard from './ProfileCard';
import Navigation from './Navigation';
import EventModal from './EventModal';
import { deleteCommunityEvent, getCommunityEvents, updateCommunityEvent, createCommunityEvent } from '../../../services/communityService';
import { useAuth } from '../../../hooks/useAuth';
import Eventimage from '../../../assets/events/tech event.webp';

export default function Events() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [eventModalError, setEventModalError] = useState('');
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuEventId, setMenuEventId] = useState(null);

  const handleMenuClick = (event, id) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuEventId(id);
  };

  const handleMenuClose = (event) => {
    if (event && event.stopPropagation) event.stopPropagation();
    setAnchorEl(null);
    setMenuEventId(null);
  };

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
    
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditEventModal = (event) => {
    setSelectedEvent(event);
    setEventModalError('');
    setModalMode('edit');
    setShowEventModal(true);
  };

  const handleOpenCreateEventModal = () => {
    setSelectedEvent(null);
    setEventModalError('');
    setModalMode('create');
    setShowEventModal(true);
  };

  const handleCloseCreateEventModal = () => {
    if (!isSavingEvent) {
      setShowEventModal(false);
      setEventModalError('');
      setSelectedEvent(null);
    }
  };

  const handleEventSubmit = async (payload) => {
    try {
      setIsSavingEvent(true);
      setEventModalError('');

      if (modalMode === 'edit') {
        if (!selectedEvent?.id) {
          setEventModalError('Please select an event to edit.');
          return;
        }
        await updateCommunityEvent(selectedEvent.id, payload);
      } else {
        await createCommunityEvent(payload);
      }

      setShowEventModal(false);
      setSelectedEvent(null);
      setActiveTab('upcoming');
      await fetchEvents();
    } catch (err) {
      console.error('Error saving event:', err);

      if (err?.response?.status === 401) {
        setEventModalError('Your session expired. Please login again.');
      } else if (err?.response?.status === 403) {
        setEventModalError('Only admin or super admin can manage events.');
      } else if (err?.response?.status >= 500) {
        setEventModalError('Server error while saving event. Please try again shortly.');
      } else {
        const apiMessage =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.response?.data?.details;
        setEventModalError(apiMessage || 'Failed to save event. Please try again.');
      }
    } finally {
      setIsSavingEvent(false);
    }
  };

  const handleDeleteEvent = async (event) => {
    const confirmed = window.confirm(`Delete event "${event?.title || 'this event'}"? This action cannot be undone.`);
    if (!confirmed || !event?.id) {
      return;
    }

    try {
      setDeletingEventId(event.id);
      await deleteCommunityEvent(event.id);
      await fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);

      if (err?.response?.status === 401) {
        window.alert('Your session expired. Please login again.');
      } else if (err?.response?.status === 403) {
        window.alert('Only admin or super admin can delete events.');
      } else if (err?.response?.status === 404) {
        window.alert('Event not found. It may already be deleted.');
      } else if (err?.response?.status >= 500) {
        window.alert('Server error while deleting event. Please try again shortly.');
      } else {
        const apiMessage =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.response?.data?.details;
        window.alert(apiMessage || 'Failed to delete event. Please try again.');
      }
    } finally {
      setDeletingEventId(null);
    }
  };

  // Filter events by search query and active tab
  const getFilteredEvents = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset to start of day for comparison
    
    let filtered = events.filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter by tab
    if (activeTab === 'upcoming') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.event_date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= now;
      });
    } else if (activeTab === 'past') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.event_date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate < now;
      });
    }

    return filtered;
  };

  const filteredEvents = getFilteredEvents();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const year = date.getFullYear();
    return { month, day, weekday, year };
  };

  const formatFullDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isEventPast = (dateStr) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const eventDate = new Date(dateStr);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < now;
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: getFilteredEvents.length },
    { id: 'past', label: 'Past' }
  ];

  return (
    <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/community')}
            className="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-100 transition-colors"
            aria-label="Back to community"
          >
            <ArrowBackIcon className="text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Events</h1>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenCreateEventModal}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-all hover:bg-indigo-700 hover:shadow-md active:scale-95 max-lg:mr-3 ml-auto lg:mr-0"
          >
            <AddIcon fontSize="small" />
            <span className="max-sm:hidden">Create Event</span>
          </button>
        )}
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          className="lg:hidden p-2 rounded-lg bg-white shadow-sm hover:bg-gray-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Left Sidebar Overlay - Mobile/Tablet */}
      {leftSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-10"
            onClick={() => setLeftSidebarOpen(false)}
          ></div>
          <div className="absolute left-0 top-0 bottom-0 w-full bg-white shadow-xl overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setLeftSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <ProfileCard />
              <Navigation />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 lg:gap-5">
        {/* Left Sidebar - Desktop */}
        <div className="hidden lg:flex flex-col gap-4 lg:gap-5">
          <ProfileCard />
          <Navigation />
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-4 lg:gap-5">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-gray-600">Discover and join upcoming campus activities.</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button className="bg-white border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center">
              <FilterListIcon fontSize="small" />
              Filter
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                )}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((event) => {
                const { month, day, weekday, year } = formatDate(event.event_date || event.date);
                const isPast = isEventPast(event.event_date || event.date);
                return (
                  <div
                    key={event.id}
                    className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group ${
                      isPast ? 'opacity-75' : ''
                    }`}
                  >
                    {/* Event Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={event.img_url || event.image || Eventimage} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 bg-white rounded-xl p-2.5 text-center shadow-lg min-w-[60px]">
                        <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{month}</div>
                        <div className="text-2xl font-extrabold text-gray-900 leading-tight">{day}</div>
                      </div>

                      {/* Status Badge */}
                      {isPast ? (
                        <div className="absolute top-4 right-4">
                          <span className="bg-gray-800/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                            Ended
                          </span>
                        </div>
                      ) : (
                        <div className="absolute top-4 right-4">
                          <span className="bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
                            Upcoming
                          </span>
                        </div>
                      )}

                      {/* Tags over image */}
                      {event.tags && event.tags.length > 0 && (
                        <div className="absolute bottom-3 left-4 flex gap-2 flex-wrap">
                          {event.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-white/90 backdrop-blur-sm text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="p-5 relative">
                      {/* Admin Actions - More Menu */}
                      {isAdmin && (
                        <div className="absolute top-4 right-4 z-10">
                          <IconButton
                            onClick={(e) => handleMenuClick(e, event.id)}
                            size="small"
                            className="text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100"
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl) && menuEventId === event.id}
                            onClose={handleMenuClose}
                            onClick={(e) => e.stopPropagation()}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            PaperProps={{
                              elevation: 2,
                              sx: { mt: 1, minWidth: 140, borderRadius: 2 }
                            }}
                          >
                            <MenuItem onClick={(e) => {
                                handleMenuClose(e);
                                handleOpenEditEventModal(event);
                            }} sx={{ fontSize: '14px', py: 1.5 }}>
                              <EditIcon sx={{ mr: 1.5, fontSize: 18, color: 'text.secondary' }} />
                              Edit
                            </MenuItem>
                            <MenuItem onClick={(e) => {
                                handleMenuClose(e);
                                handleDeleteEvent(event);
                            }} sx={{ color: 'error.main', fontSize: '14px', py: 1.5 }}>
                              <DeleteOutlineIcon sx={{ mr: 1.5, fontSize: 18 }} />
                              {deletingEventId === event.id ? 'Deleting...' : 'Delete'}
                            </MenuItem>
                          </Menu>
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 pr-10 group-hover:text-indigo-600 transition-colors">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {event.description || 'No description available for this event.'}
                      </p>

                      {/* Details Grid */}
                      <div className="space-y-2.5 mb-4">
                        {/* Date & Weekday */}
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50">
                            <CalendarTodayIcon sx={{ fontSize: 16 }} className="text-indigo-500" />
                          </div>
                          <span className="font-medium">{formatFullDate(event.event_date || event.date)}</span>
                        </div>

                        {/* Time */}
                        {event.time && (
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50">
                              <AccessTimeIcon sx={{ fontSize: 16 }} className="text-amber-500" />
                            </div>
                            <span>{event.time}</span>
                          </div>
                        )}

                        {/* Location */}
                        {event.location && (
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50">
                              <LocationOnIcon sx={{ fontSize: 16 }} className="text-emerald-500" />
                            </div>
                            <span>{event.location}</span>
                          </div>
                        )}


                      </div>

                      {/* Created by */}
                      {event.created_by_name && (
                        <div className="flex items-center gap-2 mb-4 pt-3 border-t border-gray-100">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-indigo-600">
                              {event.created_by_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            Created by <span className="font-medium text-gray-700">{event.created_by_name}</span>
                          </span>
                        </div>
                      )}


                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center">
                <CalendarTodayIcon className="text-indigo-400" sx={{ fontSize: 28 }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No events found</h3>
              <p className="text-gray-500 text-sm">
                {searchQuery
                  ? `No events matching "${searchQuery}"`
                  : activeTab === 'upcoming'
                  ? 'No upcoming events at the moment.'
                  : 'No past events to display.'}
              </p>
            </div>
          )}
        </div>
      </div>

      <EventModal
        isOpen={showEventModal}
        onClose={handleCloseCreateEventModal}
        onSubmit={handleEventSubmit}
        mode={modalMode}
        initialValues={selectedEvent}
        isSubmitting={isSavingEvent}
        submitError={eventModalError}
      />
    </div>
  );
}
