import { useState } from 'react';
import AddCourseOfferingModal from './AddCourseOfferingModal';

export default function SemesterOfferedCourses() {
  const [offerings, setOfferings] = useState([
    {
      offering_id: 1,
      course_code: 'CS101',
      course_name: 'Intro to Computer Science',
      credits: 3,
      semester: 'Fall',
      year: 2025,
      lectures_count: 1,
      tutorials_labs_count: 1,
      exams_count: 0,
    },
    {
      offering_id: 4,
      course_code: 'CS101',
      course_name: 'Intro to Computer Science',
      credits: 3,
      semester: 'Fall',
      year: 2025,
      lectures_count: 0,
      tutorials_labs_count: 0,
      exams_count: 0,
    },
    {
      offering_id: 2,
      course_code: 'CS201',
      course_name: 'Data Structures',
      credits: 4,
      semester: 'Fall',
      year: 2025,
      lectures_count: 1,
      tutorials_labs_count: 0,
      exams_count: 0,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffering, setEditingOffering] = useState(null);

  const handleEdit = (id) => {
    const offering = offerings.find(o => o.offering_id === id);
    if (offering) {
      setEditingOffering(offering);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course offering?')) {
      setOfferings(offerings.filter(offering => offering.offering_id !== id));
    }
  };

  const handleSaveOffering = (formData) => {
    if (editingOffering) {
      // Update existing offering
      setOfferings(offerings.map(offering => 
        offering.offering_id === editingOffering.offering_id 
          ? {
              ...offering,
              course_code: formData.course_code,
              semester: formData.semester,
              year: parseInt(formData.year),
            }
          : offering
      ));
      setEditingOffering(null);
    } else {
      // Add new offering
      const newOffering = {
        offering_id: offerings.length + 1,
        course_code: formData.course_code,
        course_name: `Course ${formData.course_code}`, // This would come from the API
        credits: 3, // This would come from the API
        semester: formData.semester,
        year: parseInt(formData.year),
        lectures_count: 0,
        tutorials_labs_count: 0,
        exams_count: 0,
      };
      setOfferings([...offerings, newOffering]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 md:p-6 border-b border-gray-200">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Semester Offered Courses</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base w-full sm:w-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Course Offering
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
                Semester
              </th>
              <th className="hidden sm:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credits
              </th>
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lectures
              </th>
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tutorials/Labs
              </th>
              <th className="hidden xl:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exams
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {offerings.map((offering) => (
              <tr key={offering.offering_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 md:px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{offering.course_name}</div>
                    <div className="text-sm text-indigo-600">{offering.course_code}</div>
                    <div className="md:hidden text-xs text-gray-500 mt-1">
                      {offering.semester} {offering.year}
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{offering.semester} {offering.year}</div>
                </td>
                <td className="hidden sm:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{offering.credits}</div>
                </td>
                <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{offering.lectures_count}</div>
                </td>
                <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{offering.tutorials_labs_count}</div>
                </td>
                <td className="hidden xl:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{offering.exams_count}</div>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(offering.offering_id)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(offering.offering_id)}
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

      {/* Add Course Offering Modal */}
      <AddCourseOfferingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOffering(null);
        }}
        onSave={handleSaveOffering}
        editingOffering={editingOffering}
      />
    </div>
  );
}
