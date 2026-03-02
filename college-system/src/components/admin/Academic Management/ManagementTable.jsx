import { useState, useEffect } from 'react';
import AddCourseModal from './AddCourseModal';
import DeleteCourseModal from './DeleteCourseModal';
import { getAllCourses, createCourse, updateCourse, deleteCourse } from '../../../services/courseService';
import { useToast } from '../../../hooks/useToast';

export default function ManagementTable() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, course: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  // Fetch all courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const data = await getAllCourses();
      setCourses(data.courses || []);
    } catch (error) {
      toast.error('Failed to load courses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (code) => {
    const course = courses.find(c => c.code === code);
    if (course) {
      // Normalize prerequisites to array of code strings for the modal
      const normalizedCourse = {
        ...course,
        prerequisites: (course.prerequisites || []).map(p =>
          typeof p === 'object' ? p.code : p
        ),
      };
      setEditingCourse(normalizedCourse);
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = (code) => {
    const course = courses.find(c => c.code === code);
    if (course) setDeleteModal({ isOpen: true, course });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteCourse(deleteModal.course.code);
      setCourses(prev => prev.filter(c => c.code !== deleteModal.course.code));
      toast.success('Course deleted successfully.');
      setDeleteModal({ isOpen: false, course: null });
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to delete course.';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveCourse = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingCourse) {
        // PATCH — update name and prerequisites only
        const payload = {
          name: formData.courseName,
          prerequisites: formData.prerequisites,
        };
        await updateCourse(editingCourse.code, payload);
        // Update local state directly — no re-fetch needed
        setCourses(prev => prev.map(c =>
          c.code === editingCourse.code
            ? {
                ...c,
                name: formData.courseName,
                prerequisites: formData.prerequisites.map(code => ({ code, name: code })),
              }
            : c
        ));
        toast.success('Course updated successfully.');
      } else {
        // POST — create new course
        const payload = {
          code: formData.courseCode,
          name: formData.courseName,
          credits: parseInt(formData.creditHours) || 0,
          department: formData.department,
          prerequisites: formData.prerequisites,
        };
        await createCourse(payload);
        // Add to local state directly — no re-fetch needed
        const newCourse = {
          code: formData.courseCode,
          name: formData.courseName,
          credits: parseInt(formData.creditHours) || 0,
          department: formData.department,
          prerequisites: formData.prerequisites.map(code => ({ code, name: code })),
        };
        setCourses(prev => [...prev, newCourse]);
        toast.success('Course created successfully.');
      }
      // Close modal after successful save
      setIsModalOpen(false);
      setEditingCourse(null);
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to save course.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper: render prerequisites as styled badge chips
  const renderPrerequisites = (prerequisites) => {
    if (!prerequisites || prerequisites.length === 0)
      return <span className="text-sm text-gray-400 italic">None</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {prerequisites.map((p, i) => {
          const code = typeof p === 'object' ? p.code : p;
          return (
            <span
              key={i}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200"
            >
              {code}
            </span>
          );
        })}
      </div>
    );
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

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No courses found. Click "Create New Course" to add one.
        </div>
      ) : (
      /* Table */
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
              <th className="hidden sm:table-cell px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credits
              </th>
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prerequisites
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.code} className="hover:bg-gray-50 transition-colors">
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
                <td className="hidden sm:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{course.credits}</div>
                </td>
                <td className="hidden lg:table-cell px-6 py-4">
                  {renderPrerequisites(course.prerequisites)}
                </td>
                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(course.code)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(course.code)}
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
      )}

      {/* Delete Confirmation Modal */}
      <DeleteCourseModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, course: null })}
        onConfirm={handleDeleteConfirm}
        course={deleteModal.course}
        isDeleting={isDeleting}
      />

      {/* Add Course Modal */}
      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCourse(null);
        }}
        onSave={handleSaveCourse}
        editingCourse={editingCourse}
        isSubmitting={isSubmitting}
        allCourses={courses}
      />
    </div>
  );
}