import { useState, useEffect } from 'react';

export default function AddLabModal({ isOpen, onClose, onSave, editingLab, allOfferings = [], teachers = [], isSubmitting = false }) {
  const [formData, setFormData] = useState({
    offeringId: '',
    taId: '',
    type: 'LAB',
    capacity: '',
    dayOfWeek: 'Monday',
    startTime: '',
    endTime: '',
    location: '',
    group: '1',
  });

  useEffect(() => {
    if (editingLab) {
      setFormData({
        offeringId: editingLab.offeringId || '',
        taId: editingLab.taId || '',
        type: editingLab.type || 'LAB',
        capacity: editingLab.capacity || '',
        dayOfWeek: editingLab.dayOfWeek || 'Monday',
        startTime: editingLab.startTime || '',
        endTime: editingLab.endTime || '',
        location: editingLab.location || '',
        group: editingLab.group || '1',
      });
    } else if (isOpen) {
      setFormData({
        offeringId: '',
        taId: '',
        type: 'LAB',
        capacity: '',
        dayOfWeek: 'Monday',
        startTime: '',
        endTime: '',
        location: '',
        group: '1',
      });
    }
  }, [editingLab, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const needsOffering = !editingLab && !formData.offeringId;
    if (needsOffering || !formData.taId || !formData.capacity ||
        !formData.startTime || !formData.endTime || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      offeringId: '',
      taId: '',
      type: 'LAB',
      capacity: '',
      dayOfWeek: 'Monday',
      startTime: '',
      endTime: '',
      location: '',
      group: '1',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              {editingLab ? 'Edit Lab/Tutorial' : 'Add New Lab/Tutorial'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 space-y-4">
          {/* Course Offering (create only) and TA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!editingLab && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Offering <span className="text-red-500">*</span>
                </label>
                <select
                  name="offeringId"
                  value={formData.offeringId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select offering...</option>
                  {allOfferings.map(o => (
                    <option key={o.offering_id} value={o.offering_id}>
                      {o.course_code} — {o.course_name} ({o.semester} {o.year})
                    </option>
                  ))}
                </select>
              </div>
            )}
            {editingLab && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm">
                  {editingLab.courseCode} — {editingLab.courseName}
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teaching Assistant <span className="text-red-500">*</span>
              </label>
              <select
                name="taId"
                value={formData.taId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select TA...</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name || `${t.firstName ?? ''} ${t.lastName ?? ''}`.trim()}
                  </option>
                ))}
              </select>
              {editingLab && editingLab.instructor && (
                <p className="text-xs text-gray-400 mt-1">Current: {editingLab.instructor}</p>
              )}
            </div>
          </div>

          {/* Type and Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="LAB">Lab</option>
                <option value="TUTORIAL">Tutorial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="group"
                value={formData.group}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="e.g., 1"
              />
            </div>
          </div>

          {/* Day of Week */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Day of Week <span className="text-red-500">*</span>
            </label>
            <select
              name="dayOfWeek"
              value={formData.dayOfWeek}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>

          {/* Start Time and End Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Capacity and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="e.g., 20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="e.g., Lab A"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 md:p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors text-sm md:text-base disabled:opacity-50"
          >
            {isSubmitting && (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {editingLab ? 'Save Changes' : 'Add Lab/Tutorial'}
          </button>
        </div>
      </div>
    </div>
  );
}
