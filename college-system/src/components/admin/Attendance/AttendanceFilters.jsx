import React from 'react';

const AttendanceFilters = ({ 
  selectedDepartment, 
  selectedCourse,
  selectedSemester,
  onDepartmentChange, 
  onCourseChange,
  onSemesterChange,
  onExportReport 
}) => {
  const departments = [
    'Overall',
    'Computer Science',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Civil Engineering'
  ];

  const semesters = [
    'Overall',
    'Fall 2025',
    'Spring 2026',
    'Summer 2025',
    'Fall 2024'
  ];

  const courses = [
    'Overall',
    'CS421: Computer Design',
    'CS301: Data Structures',
    'ME205: Thermodynamics'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <select
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => onSemesterChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            {semesters.map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </select>

          <select
            value={selectedCourse}
            onChange={(e) => onCourseChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onExportReport}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export Report
        </button>
      </div>
    </div>
  );
};

export default AttendanceFilters;
