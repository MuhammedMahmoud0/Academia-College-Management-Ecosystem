import * as React from 'react';
import { BookOpen } from 'lucide-react';

const getGradeColor = (grade) => {
  if (!grade || grade === 'N/A') return 'bg-gray-100 text-gray-700';
  if (['A+', 'A', 'A-'].includes(grade)) return 'bg-[#d9fdd3] text-green-900 border-none';
  if (['B+', 'B', 'B-'].includes(grade)) return 'bg-[#d3e3fd] text-blue-900 border-none';
  if (['C+', 'C', 'C-'].includes(grade)) return 'bg-yellow-100 text-yellow-900 border-none';
  if (['D', 'F'].includes(grade)) return 'bg-red-100 text-red-900 border-none';
  return 'bg-gray-100 text-gray-800 border-none';
};

const getStatusColor = (status) => {
  if (status === 'completed') return 'text-green-700 bg-green-50';
  if (status === 'enrolled') return 'text-blue-700 bg-blue-50';
  if (status === 'withdrawn') return 'text-red-700 bg-red-50';
  return 'text-gray-600 bg-gray-50';
};

export default function GradesTable({ courses = [] }) {
  if (!courses.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-white">
         <BookOpen className="w-10 h-10 text-gray-300 mb-3" />
         <p className="text-base">No courses found</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-gray-200">
            <th className="py-3 px-5 font-medium text-gray-700 text-sm">Course Code</th>
            <th className="py-3 px-5 font-medium text-gray-700 text-sm">Course Name</th>
            <th className="py-3 px-5 font-medium text-gray-700 text-sm">Instructor</th>
            <th className="py-3 px-5 font-medium text-gray-700 text-sm">Credits</th>
            <th className="py-3 px-5 font-medium text-gray-700 text-sm">Semester</th>
            <th className="py-3 px-5 font-medium text-gray-700 text-sm">Midterm</th>
            <th className="py-3 px-5 font-medium text-gray-700 text-sm">Work</th>
            <th className="py-3 px-5 font-medium text-gray-700 text-sm">Final</th>
            <th className="py-3 px-5 font-medium text-gray-700 text-sm">Grade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {courses.map((course, idx) => (
            <tr 
              key={course.id || idx} 
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-5 whitespace-nowrap text-sm text-gray-800">
                {course.code}
              </td>
              <td className="py-4 px-5">
                <div className="text-sm text-gray-800 font-medium">{course.name}</div>
                <div className="mt-1">
                  <span className={`text-[0.65rem] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${getStatusColor(course.status)}`}>
                    {course.status}
                  </span>
                </div>
              </td>
              <td className="py-4 px-5 whitespace-nowrap text-sm text-gray-600">
                {course.instructor}
              </td>
              <td className="py-4 px-5 whitespace-nowrap text-sm text-gray-700">
                {course.credits}
              </td>
              <td className="py-4 px-5 whitespace-nowrap text-sm text-gray-600">
                {course.semester} {course.year}
              </td>
              <td className="py-4 px-5 whitespace-nowrap text-sm text-gray-700 font-medium">
                {course.midterm_score ?? '-'}
              </td>
              <td className="py-4 px-5 whitespace-nowrap text-sm text-gray-700 font-medium">
                {course.work_score ?? '-'}
              </td>
              <td className="py-4 px-5 whitespace-nowrap text-sm text-gray-700 font-medium">
                {course.final_score ?? '-'}
              </td>
              <td className="py-4 px-5 whitespace-nowrap">
                <span className={`inline-flex items-center justify-center px-3 py-1 text-sm font-semibold rounded-full ${getGradeColor(course.grade)}`}>
                  {course.grade}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
