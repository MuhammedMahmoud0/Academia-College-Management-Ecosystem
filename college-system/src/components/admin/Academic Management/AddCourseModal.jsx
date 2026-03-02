import { useState, useEffect } from 'react';

export default function AddCourseModal({ isOpen, onClose, onSave, editingCourse, isSubmitting = false, allCourses = [] }) {
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    creditHours: '',
    department: 'Computer Science',
    prerequisites: [],
  });

  const [selectedPrereq, setSelectedPrereq] = useState('');

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        courseCode: editingCourse.code || '',
        courseName: editingCourse.name || '',
        creditHours: editingCourse.credits?.toString() || '',
        department: editingCourse.department || 'Computer Science',
        prerequisites: editingCourse.prerequisites || [],
      });
    } else {
      setFormData({
        courseCode: '',
        courseName: '',
        creditHours: '',
        department: 'Computer Science',
        prerequisites: [],
      });
    }
  }, [editingCourse, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Courses available to pick as prerequisites (exclude self and already-added)
  const availablePrereqs = allCourses.filter(
    c => c.code !== formData.courseCode && !formData.prerequisites.includes(c.code)
  );

  const handleAddPrerequisite = () => {
    if (selectedPrereq && !formData.prerequisites.includes(selectedPrereq)) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, selectedPrereq],
      }));
      setSelectedPrereq('');
    }
  };

  const handleRemovePrerequisite = (prerequisite) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(p => p !== prerequisite)
    }));
  };

  const handleSubmit = () => {
    // Parent is responsible for closing the modal after a successful save
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      courseCode: '',
      courseName: '',
      creditHours: '',
      department: 'Computer Science',
      prerequisites: [],
    });
    setSelectedPrereq('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            {editingCourse ? 'Edit Course' : 'Create New Course'}
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
          {/* Course Code and Course Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Code
              </label>
              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., CS101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Name
              </label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Introduction to Programming"
              />
            </div>
          </div>

          {/* Credit Hours and Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Credit Hours
              </label>
              <input
                type="number"
                name="creditHours"
                value={formData.creditHours}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Engineering">Engineering</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Business">Business</option>
              </select>
            </div>
          </div>

          {/* Prerequisites */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prerequisites
            </label>
            <div className="flex gap-2 mb-2">
              {availablePrereqs.length === 0 ? (
                <p className="flex-1 px-3 py-2 text-sm text-gray-400 border border-gray-200 rounded-lg bg-gray-50">
                  {allCourses.length === 0 ? 'No courses available' : 'All courses already added'}
                </p>
              ) : (
                <select
                  value={selectedPrereq}
                  onChange={(e) => setSelectedPrereq(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  <option value="">Select a course...</option>
                  {availablePrereqs.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </select>
              )}
              <button
                type="button"
                onClick={handleAddPrerequisite}
                disabled={!selectedPrereq}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            {formData.prerequisites.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.prerequisites.map((prerequisite, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {prerequisite}
                    <button
                      type="button"
                      onClick={() => handleRemovePrerequisite(prerequisite)}
                      className="hover:text-indigo-900"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
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
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {isSubmitting ? 'Saving...' : 'Save Course'}
          </button>
        </div>
      </div>
    </div>
  );
}
