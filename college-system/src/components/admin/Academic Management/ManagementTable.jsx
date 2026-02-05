import { useState } from 'react';
import AddCourseModal from './AddCourseModal';

export default function ManagementTable() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: 'Introduction to Programming',
      code: 'CS101',
      department: 'Computer Science',
      instructor: 'Dr. Evelyn Reed',
      enrolled: 150,
      credits: 3,
    },
    {
      id: 2,
      name: 'Data Structures & Algorithms',
      code: 'CS260',
      department: 'Computer Science',
      instructor: 'Dr. Evelyn Reed',
      enrolled: 120,
      credits: 3,
    },
    {
      id: 3,
      name: 'Digital Logic Design',
      code: 'EE200',
      department: 'Engineering',
      instructor: 'Dr. Olivia Garcia',
      enrolled: 95,
      credits: 3,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const handleEdit = (id) => {
    const course = courses.find(c => c.id === id);
    if (course) {
      setEditingCourse(course);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const handleSaveCourse = (formData) => {
    if (editingCourse) {
      // Update existing course
      setCourses(courses.map(course => 
        course.id === editingCourse.id 
          ? {
              ...course,
              name: formData.courseName,
              code: formData.courseCode,
              department: formData.department,
              instructor: formData.instructor,
              credits: parseInt(formData.creditHours) || 0,
            }
          : course
      ));
      setEditingCourse(null);
    } else {
      // Add new course
      const newCourse = {
        id: courses.length + 1,
        name: formData.courseName,
        code: formData.courseCode,
        department: formData.department,
        instructor: formData.instructor,
        enrolled: 0,
        credits: parseInt(formData.creditHours) || 0,
      };
      setCourses([...courses, newCourse]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 md:p-6 border-b border-gray-200">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Course Catalog</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base w-full sm:w-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Course
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instructor
              </th>
              <th className="hidden sm:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enrolled
              </th>
              <th className="hidden sm:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credits
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 md:px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{course.name}</div>
                    <div className="text-sm text-indigo-600">{course.code}</div>
                    <div className="md:hidden text-xs text-gray-500 mt-1">{course.department}</div>
                  </div>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{course.department}</div>
                </td>
                <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{course.instructor}</div>
                </td>
                <td className="hidden sm:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{course.enrolled}</div>
                </td>
                <td className="hidden sm:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{course.credits}</div>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(course.id)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Course Modal */}
      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCourse(null);
        }}
        onSave={handleSaveCourse}
        editingCourse={editingCourse}
      />
    </div>
  );
}