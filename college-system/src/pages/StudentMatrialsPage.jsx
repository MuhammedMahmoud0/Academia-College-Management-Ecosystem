import { useState } from 'react';
import LecturesMatrial from '../components/student/Student Matrials/LecturesMatrial';
import ExternalResourses from '../components/student/Student Matrials/ExternalResourses';
import { Search } from '@mui/icons-material';

export default function StudentMatrialsPage() {

  const [selectedCourse, setSelectedCourse] = useState('CS462');

  const lectures = [
    {
      id: 1,
      title: 'Lecture 1 - Intro to ML.pdf',
      uploadDate: '2025-09-05',
    },
    {
      id: 2,
      title: 'Lecture 2 - Supervised Learning.pdf',
      uploadDate: '2025-09-12',
    },
  ];

  const externalResources = [
    {
      id: 1,
      title: 'Google AI Blog',
      uploadDate: '2025-09-15',
      url: 'https://ai.googleblog.com',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Course Materials
        </h1>
       
      </div>
       

      {/* Course Selection and Search */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {/* Course Dropdown */}
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="CS462">CS462: Machine Learning</option>
            <option value="CS101">CS101: Introduction to Programming</option>
            <option value="CS201">CS201: Data Structures</option>
            <option value="CS301">CS301: Algorithms</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search materials..."
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Lecture Materials Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
          Lecture Materials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {lectures.map((lecture) => (
            <LecturesMatrial key={lecture.id} lecture={lecture} />
          ))}
        </div>
      </div>

      {/* External Resources Section */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
          External Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {externalResources.map((resource) => (
            <ExternalResourses key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    </div>
  );
}