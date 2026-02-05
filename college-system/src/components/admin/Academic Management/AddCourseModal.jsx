import { useState, useEffect } from 'react';

export default function AddCourseModal({ isOpen, onClose, onSave, editingCourse }) {
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    instructor: '',
    creditHours: '',
    department: 'Computer Science',
    prerequisites: [],
  });

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        courseCode: editingCourse.code || '',
        courseName: editingCourse.name || '',
        instructor: editingCourse.instructor || '',
        creditHours: editingCourse.credits?.toString() || '',
        department: editingCourse.department || 'Computer Science',
        prerequisites: editingCourse.prerequisites || [],
      });
    } else {
      setFormData({
        courseCode: '',
        courseName: '',
        instructor: '',
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

  const handlePrerequisiteToggle = (prerequisite) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.includes(prerequisite)
        ? prev.prerequisites.filter(p => p !== prerequisite)
        : [...prev.prerequisites, prerequisite]
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      courseCode: '',
      courseName: '',
      instructor: '',
      creditHours: '',
      department: 'Computer Science',
      prerequisites: [],
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructor
            </label>
            <textarea
              name="instructor"
              value={formData.instructor}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Enter instructor name..."
            />
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
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.prerequisites.includes('CS101')}
                  onChange={() => handlePrerequisiteToggle('CS101')}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">CS101: Introduction to Programming</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.prerequisites.includes('CS260')}
                  onChange={() => handlePrerequisiteToggle('CS260')}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">CS260: Data Structures & Algorithms</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.prerequisites.includes('EE200')}
                  onChange={() => handlePrerequisiteToggle('EE200')}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">EE200: Digital Logic Design</span>
              </label>
            </div>
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
            Save Course
          </button>
        </div>
      </div>
    </div>
  );
}
