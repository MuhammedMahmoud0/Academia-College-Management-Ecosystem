import { useState, useEffect } from 'react';
import AddCourseOfferingModal from './AddCourseOfferingModal';
import DeleteOfferingModal from './DeleteOfferingModal';
import { getAllOfferings, createOffering, updateOffering, deleteOffering } from '../../../services/courseOfferingService';
import { getAllCourses } from '../../../services/courseService';
import { useToast } from '../../../hooks/useToast';

export default function SemesterOfferedCourses() {
  const [offerings, setOfferings] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffering, setEditingOffering] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, offering: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [offeringsRes, coursesRes] = await Promise.all([
        getAllOfferings(),
        getAllCourses(),
      ]);
      setOfferings(offeringsRes.data || []);
      setAllCourses(coursesRes.courses || []);
    } catch {
      toast.error('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id) => {
    const offering = offerings.find(o => o.offering_id === id);
    if (offering) {
      setEditingOffering(offering);
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    const offering = offerings.find(o => o.offering_id === id);
    if (offering) setDeleteModal({ isOpen: true, offering });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteOffering(deleteModal.offering.offering_id);
      setOfferings(prev => prev.filter(o => o.offering_id !== deleteModal.offering.offering_id));
      toast.success('Course offering deleted successfully.');
      setDeleteModal({ isOpen: false, offering: null });
    } catch (error) {
      const msg = error?.response?.data?.error || error?.response?.data?.message || 'Failed to delete offering.';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveOffering = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingOffering) {
        // PUT — update semester and year only
        const payload = {
          semester: formData.semester,
          year: parseInt(formData.year),
        };
        await updateOffering(editingOffering.offering_id, payload);
        setOfferings(prev => prev.map(o =>
          o.offering_id === editingOffering.offering_id
            ? { ...o, semester: formData.semester, year: parseInt(formData.year) }
            : o
        ));
        toast.success('Course offering updated successfully.');
      } else {
        // POST — create new offering
        const payload = {
          course_code: formData.course_code,
          semester: formData.semester,
          year: parseInt(formData.year),
        };
        const res = await createOffering(payload);
        const created = res.data;
        // Find course info to fill name/credits locally
        const course = allCourses.find(c => c.code === formData.course_code);
        const newOffering = {
          offering_id: created.offering_id,
          course_code: created.course_code,
          course_name: created.course_name || course?.name || formData.course_code,
          credits: created.credits || course?.credits || 0,
          semester: created.semester,
          year: created.year,
          lectures_count: 0,
          tutorials_labs_count: 0,
          exams_count: 0,
        };
        setOfferings(prev => [...prev, newOffering]);
        toast.success('Course offering created successfully.');
      }
      setIsModalOpen(false);
      setEditingOffering(null);
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to save course offering.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
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

      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : offerings.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No course offerings found. Click "Create New Course Offering" to add one.
        </div>
      ) : (
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
                  Tutorials / Labs
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {offering.semester} {offering.year}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{offering.credits}</div>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                      {offering.lectures_count}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700">
                      {offering.tutorials_labs_count}
                    </span>
                  </td>
                  <td className="hidden xl:table-cell px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700">
                      {offering.exams_count}
                    </span>
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
                        onClick={() => handleDeleteClick(offering.offering_id)}
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
      <DeleteOfferingModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, offering: null })}
        onConfirm={handleDeleteConfirm}
        offering={deleteModal.offering}
        isDeleting={isDeleting}
      />

      {/* Add / Edit Offering Modal */}
      <AddCourseOfferingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOffering(null);
        }}
        onSave={handleSaveOffering}
        editingOffering={editingOffering}
        allCourses={allCourses}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
