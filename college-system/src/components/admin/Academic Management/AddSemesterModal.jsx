import { useState, useEffect } from 'react';

export default function AddSemesterModal({ isOpen, onClose, onSave, editingSection }) {
  const [formData, setFormData] = useState({
    course: 'CS101',
    instructor: 'Dr. Evelyn Reed',
    days: '',
    time: '',
    classroom: '',
    capacity: '50',
  });

  useEffect(() => {
    if (editingSection) {
      // Parse schedule back to days and time
      const scheduleParts = editingSection.schedule.split(' ');
      const days = scheduleParts[0] + (scheduleParts[1] ? ' ' + scheduleParts[1] : '');
      const time = scheduleParts.slice(2).join(' ') || '';
      
      setFormData({
        course: editingSection.course || 'CS101',
        instructor: editingSection.instructor || 'Dr. Evelyn Reed',
        days: days,
        time: time,
        classroom: editingSection.location || '',
        capacity: editingSection.capacity?.toString() || '50',
      });
    } else {
      setFormData({
        course: 'CS101',
        instructor: 'Dr. Evelyn Reed',
        days: '',
        time: '',
        classroom: '',
        capacity: '50',
      });
    }
  }, [editingSection, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      course: 'CS101',
      instructor: 'Dr. Evelyn Reed',
      days: '',
      time: '',
      classroom: '',
      capacity: '50',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            {editingSection ? 'Edit Section' : 'Schedule a New Section'}
          </h3>
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
          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course
            </label>
            <select
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="CS101">CS101 - Intro to Programming</option>
              <option value="CS240">CS240 - Data Structures & Algorithms</option>
              <option value="CS260">CS260 - Advanced Programming</option>
              <option value="EE200">EE200 - Digital Logic Design</option>
            </select>
          </div>
            {/* Instructor and Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructor
              </label>
              <select
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Dr. Evelyn Reed">Dr. Evelyn Reed</option>
                <option value="Dr. Olivia Garcia">Dr. Olivia Garcia</option>
                <option value="Prof. James Wilson">Prof. James Wilson</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days
              </label>
              <input
                type="text"
                name="days"
                value={formData.days}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Mon, Wed"
              />
            </div>
          </div>

          {/* Time and Classroom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 10:00 - 11:30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classroom
              </label>
              <input
                type="text"
                name="classroom"
                value={formData.classroom}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Hall A-101"
              />
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="50"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 md:p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base"
          >
            Schedule Section
          </button>
        </div>
      </div>
    </div>
  );
}
