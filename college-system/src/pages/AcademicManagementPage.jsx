import { useState } from 'react';
import ManagementTable from '../components/admin/Academic Management/ManagementTable';
import SemesterScheduling from '../components/admin/Academic Management/SemesterScheduling';
import DepartmentsPrograms from '../components/admin/Academic Management/DepartmentsPrograms';
import SemesterOfferedCourses from '../components/admin/Academic Management/SemesterOfferedCourses';

export default function AcademicManagementPage() {
  const [activeTab, setActiveTab] = useState('course-catalog');

  return (
     <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
      {/* Header */}
     <h1 className="text-3xl font-bold text-slate-900 mb-6">Academic Management</h1>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4 md:mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('course-catalog')}
          className={`flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
            activeTab === 'course-catalog'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Course Catalog
        </button>
        <button
          onClick={() => setActiveTab('semester-offered-courses')}
          className={`flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
            activeTab === 'semester-offered-courses'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Semester Offered Courses
        </button>
        <button
          onClick={() => setActiveTab('semester-scheduling')}
          className={`flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
            activeTab === 'semester-scheduling'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Semester Scheduling
        </button>
        <button
          onClick={() => setActiveTab('departments-programs')}
          className={`flex items-center justify-center sm:justify-start gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
            activeTab === 'departments-programs'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Departments
        </button>
      </div>

      {/* Content */}
      {activeTab === 'course-catalog' && <ManagementTable />}
      {activeTab === 'semester-scheduling' && <SemesterScheduling />}
      {activeTab === 'departments-programs' && <DepartmentsPrograms />}
      {activeTab === 'semester-offered-courses' && <SemesterOfferedCourses />}
    </div>
  );
}