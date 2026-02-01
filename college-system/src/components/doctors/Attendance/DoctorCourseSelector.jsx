import React from 'react';

const DoctorCourseSelector = ({ courses, selectedCourse, onCourseChange }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <select
        value={selectedCourse}
        onChange={(e) => onCourseChange(e.target.value)}
        className="w-full md:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium text-gray-700"
      >
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.code}: {course.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DoctorCourseSelector;
