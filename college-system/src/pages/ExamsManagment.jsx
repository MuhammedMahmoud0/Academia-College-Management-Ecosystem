import { useCallback, useEffect, useState } from 'react';
import ExamFormDialog from '../components/admin/Exam Mangaement/ExamFormDialog';
import ExamsManagementTable from '../components/admin/Exam Mangaement/ExamsManagementTable';
import DeleteExamModal from '../components/admin/Exam Mangaement/DeleteExamModal';
import {
  createExam,
  deleteExam,
  getActiveCourseOfferings,
  getAllExams,
  updateExam,
} from '../services/examScheduleManagement';
import { useToast } from '../hooks/useToast';

export default function ExamsManagment() {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedExam, setSelectedExam] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, exam: null });
  const [activeOfferings, setActiveOfferings] = useState([]);
  const toast = useToast();

  const fetchExams = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllExams();
      setExams(response?.data || []);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load exams. Please try again.';
      toast.error(message);
      setExams([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const fetchActiveOfferings = useCallback(async () => {
    try {
      setIsLoadingOfferings(true);
      const response = await getActiveCourseOfferings();
      setActiveOfferings(response?.data || []);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load course offerings.';
      toast.error(message);
      setActiveOfferings([]);
    } finally {
      setIsLoadingOfferings(false);
    }
  }, [toast]);

  const openCreateDialog = () => {
    setDialogMode('create');
    setSelectedExam(null);
    setDialogOpen(true);
    fetchActiveOfferings();
  };

  const openEditDialog = (exam) => {
    setDialogMode('edit');
    setSelectedExam(exam);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedExam(null);
  };

  const handleSubmitExam = async (examData) => {
    try {
      setIsSubmitting(true);

      if (dialogMode === 'create') {
        await createExam(examData);
        toast.success('Exam created successfully.');
      } else {
        await updateExam(selectedExam.exam_id, examData);
        toast.success('Exam updated successfully.');
      }

      closeDialog();
      await fetchExams();
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to save exam. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (exam) => {
    setDeleteModal({ isOpen: true, exam });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.exam) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteExam(deleteModal.exam.exam_id);
      toast.success('Exam deleted successfully.');
      setDeleteModal({ isOpen: false, exam: null });
      await fetchExams();
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to delete exam. Please try again.';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
      <div className=" rounded-lg shadow mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">Exams Management</h2>
          <button
            onClick={openCreateDialog}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base w-full sm:w-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Exam
          </button>
        </div>
      </div>

      <ExamsManagementTable
        exams={exams}
        isLoading={isLoading}
        onEditExam={openEditDialog}
        onDeleteExam={handleDeleteClick}
      />

      <ExamFormDialog
        open={dialogOpen}
        mode={dialogMode}
        initialValues={selectedExam}
        activeOfferings={activeOfferings}
        isLoadingOfferings={isLoadingOfferings}
        isSubmitting={isSubmitting}
        onClose={closeDialog}
        onSubmit={handleSubmitExam}
      />

      <DeleteExamModal
        isOpen={deleteModal.isOpen}
        exam={deleteModal.exam}
        isDeleting={isDeleting}
        onClose={() => setDeleteModal({ isOpen: false, exam: null })}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}