import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Filter, Calendar as CalendarIcon } from 'lucide-react';
import Toast from '../../Toast/Toast';
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  notifyRegistrationOpen
} from '../../../services/systemConfiguration';

const EVENT_TYPES = [
  'semester_start',
  'semester_end',
  'registration_start',
  'registration_end',
  'payment_start',
  'payment_end',
  'registration_deadline',
  'exam_week',
  'midterm',
  'final_exam',
  'holiday',
  'orientation',
  'other',
];

const EVENT_TYPE_COLORS = {
  semester_start:       'bg-blue-100 text-blue-800',
  semester_end:         'bg-blue-100 text-blue-800',
  registration_start:   'bg-green-100 text-green-800',
  registration_end:     'bg-green-100 text-green-800',
  payment_start:        'bg-yellow-100 text-yellow-800',
  payment_end:          'bg-yellow-100 text-yellow-800',
  registration_deadline:'bg-red-100 text-red-800',
  exam_week:            'bg-purple-100 text-purple-800',
  midterm:              'bg-purple-100 text-purple-800',
  final_exam:           'bg-purple-100 text-purple-800',
  holiday:              'bg-pink-100 text-pink-800',
  orientation:          'bg-indigo-100 text-indigo-800',
  other:                'bg-gray-100 text-gray-800',
};

const EMPTY_FORM = {
  event_name: '',
  event_type: 'semester_start',
  event_date: '',
  end_date: '',
  description: '',
  semester: '',
  academic_year: '',
};

export default function AcademicCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // event to confirm-delete
  const [filters, setFilters] = useState({ semester: '', academic_year: '', event_type: '' });
  const [showFilters, setShowFilters] = useState(false);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (activeFilters = filters) => {
    setLoading(true);
    try {
      const res = await getCalendarEvents(activeFilters);
      setEvents(res.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load calendar events.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    fetchEvents(filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const reset = { semester: '', academic_year: '', event_type: '' };
    setFilters(reset);
    fetchEvents(reset);
    setShowFilters(false);
  };

  const openCreate = () => {
    setEditingEvent(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    setForm({
      event_name: event.event_name,
      event_type: event.event_type,
      event_date: event.event_date?.split('T')[0] || '',
      end_date: event.end_date?.split('T')[0] || '',
      description: event.description || '',
      semester: event.semester || '',
      academic_year: event.academic_year || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.event_name || !form.event_date) {
      showToast('Event name and start date are required.', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editingEvent) {
        const res = await updateCalendarEvent(editingEvent.id, form);
        setEvents(prev => prev.map(e => e.id === editingEvent.id ? res.data : e));
        showToast('Event updated successfully!');
      } else {
        const res = await createCalendarEvent(form);
        setEvents(prev => [...prev, res.data]);
        showToast('Event created successfully!');

        // Auto-notify all students when a registration_start event is created
        if (form.event_type === 'registration_start') {
          try {
            const notifRes = await notifyRegistrationOpen();
            showToast(notifRes.message || 'Students notified that registration is open!');
          } catch {
            showToast('Event created, but failed to send registration notifications.', 'warning');
          }
        }
      }
      setShowModal(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save event.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (event) => {
    setDeleteTarget(event); // open the confirm modal
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await deleteCalendarEvent(deleteTarget.id);
      setEvents(prev => prev.filter(e => e.id !== deleteTarget.id));
      showToast('Event deleted successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete event.', 'error');
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      {toast && (
        <div className="fixed top-24 right-4 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Academic Calendar</h2>
          <p className="text-sm text-gray-500 mt-1">Manage key academic events and dates.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFilters(v => !v)}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
          >
            <Filter size={15} /> Filters
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
          >
            <Plus size={15} /> Add Event
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-5 p-4 border border-gray-200 rounded-xl bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Semester</label>
              <input
                type="text"
                placeholder='e.g. "Fall 2026"'
                value={filters.semester}
                onChange={e => setFilters(p => ({ ...p, semester: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Academic Year</label>
              <input
                type="text"
                placeholder='e.g. "2026-2027"'
                value={filters.academic_year}
                onChange={e => setFilters(p => ({ ...p, academic_year: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Event Type</label>
              <select
                value={filters.event_type}
                onChange={e => setFilters(p => ({ ...p, event_type: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white"
              >
                <option value="">All types</option>
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={clearFilters} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">Clear</button>
            <button onClick={applyFilters} className="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Apply</button>
          </div>
        </div>
      )}

      {/* Events List */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
          <CalendarIcon size={40} className="text-gray-300" />
          <p className="text-sm">No calendar events found.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {events.map(event => (
            <div key={event.id} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-800">{event.event_name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${EVENT_TYPE_COLORS[event.event_type] || 'bg-gray-100 text-gray-700'}`}>
                    {event.event_type?.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span>📅 {event.event_date?.split('T')[0]}{event.end_date ? ` → ${event.end_date.split('T')[0]}` : ''}</span>
                  {event.semester && <span>Semester: {event.semester}</span>}
                  {event.academic_year && <span>Year: {event.academic_year}</span>}
                  {event.users?.full_name && <span>By: {event.users.full_name}</span>}
                </div>
                {event.description && (
                  <p className="text-xs text-gray-400 mt-1 truncate">{event.description}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEdit(event)}
                  className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-500 hover:text-indigo-700 transition-colors"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(event)}
                  disabled={deletingId === event.id}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingEvent ? 'Edit Event' : 'Add Calendar Event'}
              </h3>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Event Name *</label>
                  <input
                    type="text"
                    value={form.event_name}
                    onChange={e => setForm(p => ({ ...p, event_name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    placeholder="e.g. Fall Semester Start"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Event Type *</label>
                  <select
                    value={form.event_type}
                    onChange={e => setForm(p => ({ ...p, event_type: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white"
                  >
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Semester</label>
                  <input
                    type="text"
                    value={form.semester}
                    onChange={e => setForm(p => ({ ...p, semester: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    placeholder="e.g. Fall"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={form.event_date}
                    onChange={e => setForm(p => ({ ...p, event_date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={form.academic_year}
                    onChange={e => setForm(p => ({ ...p, academic_year: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    placeholder="e.g. 2026-2027"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none"
                    placeholder="Optional description..."
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg transition-colors font-medium"
              >
                {saving ? 'Saving...' : editingEvent ? 'Save Changes' : 'Create Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Delete Event</h3>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-gray-800">"{deleteTarget.event_name}"</span>?
                This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId === deleteTarget.id}
                className="px-5 py-2 text-sm bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-lg transition-colors font-medium"
              >
                {deletingId === deleteTarget.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
