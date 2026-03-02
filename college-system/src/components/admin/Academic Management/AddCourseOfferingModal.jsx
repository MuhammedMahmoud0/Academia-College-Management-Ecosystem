import { useState, useEffect } from 'react';

export default function AddCourseOfferingModal({ isOpen, onClose, onSave, editingOffering, allCourses = [], isSubmitting = false }) {
  const [formData, setFormData] = useState({
    course_code: '',
    semester: 'Fall',
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    if (editingOffering) {
      setFormData({
        course_code: editingOffering.course_code || '',
        semester: editingOffering.semester || 'Fall',
        year: editingOffering.year || new Date().getFullYear(),
      });
    } else if (isOpen) {
      setFormData({
        course_code: '',
        semester: 'Fall',
        year: new Date().getFullYear(),
      });
    }
  }, [editingOffering, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.course_code || !formData.semester || !formData.year) return;
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({ course_code: '', semester: 'Fall', year: new Date().getFullYear() });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            {editingOffering ? 'Edit Course Offering' : 'Create New Course Offering'}
          </h3>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 space-y-4">
          {/* Course Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course
            </label>
            {editingOffering ? (
              // In edit mode show the course as read-only (only semester/year can change)
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700">
                <span className="font-semibold text-indigo-600">{editingOffering.course_code}</span>
                {' — '}{editingOffering.course_name}
              </div>
            ) : (
              <select
                name="course_code"
                value={formData.course_code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="">Select a course...</option>
                {allCourses.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Semester and Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 2026"
                min="2020"
                max="2035"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 md:p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (!editingOffering && !formData.course_code)}
            className="w-full sm:w-auto px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {isSubmitting ? 'Saving...' : editingOffering ? 'Save Changes' : 'Create Offering'}
          </button>
        </div>
      </div>
    </div>
  );
}
