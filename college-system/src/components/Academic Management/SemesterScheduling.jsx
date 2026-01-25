import { useState } from 'react';
import AddSemesterModal from './AddSemesterModal';

export default function SemesterScheduling() {
  const [sections, setSections] = useState([
    {
      id: 1,
      course: 'CS101',
      instructor: 'Dr. Evelyn Reed',
      schedule: 'Sun, Tue 10:00-12:00',
      location: 'Hall A-101',
      enrolled: 150,
      capacity: 150,
    },
    {
      id: 2,
      course: 'CS240',
      instructor: 'Dr. Evelyn Reed',
      schedule: 'Mon, Wed 14:00-16:00',
      location: 'Hall B-201',
      enrolled: 120,
      capacity: 120,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (id) => {
    console.log('Edit section:', id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      setSections(sections.filter(section => section.id !== id));
    }
  };

  const handleSaveSection = (formData) => {
    const newSection = {
      id: sections.length + 1,
      course: formData.course,
      instructor: formData.instructor,
      schedule: `${formData.days} ${formData.time}`,
      location: formData.classroom,
      enrolled: 0,
      capacity: parseInt(formData.capacity) || 50,
    };
    setSections([...sections, newSection]);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 md:p-6 border-b border-gray-200">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Fall 2025 Schedule</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base w-full sm:w-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Schedule New Section
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
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instructor
              </th>
              <th className="hidden md:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Schedule
              </th>
              <th className="hidden sm:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="hidden sm:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enrollment
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sections.map((section) => (
              <tr key={section.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 md:px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{section.course}</div>
                    <div className="md:hidden text-xs text-gray-500 mt-1">{section.schedule}</div>
                  </div>
                </td>
                <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{section.instructor}</div>
                </td>
                <td className="hidden md:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{section.schedule}</div>
                </td>
                <td className="hidden sm:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{section.location}</div>
                </td>
                <td className="hidden sm:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {section.enrolled} / {section.capacity}
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(section.id)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
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

      {/* Add Section Modal */}
      <AddSemesterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSection}
      />
    </div>
  );
}
