import React, { useState, useEffect, useCallback } from 'react';
import Toast from '../../Toast/Toast';
import StudentTaskCard from './StudentTaskCard';
import StudentSubmitTaskModal from './StudentSubmitTaskModal';
import StudentViewTaskModal from './StudentViewTaskModal';
import StudentDeleteConfirmModal from './StudentDeleteConfirmModal';
import { Loader2, AlertCircle, BookOpen } from 'lucide-react';

import {
    getMyAvailableTasks,
    submitTask,
    deleteMySubmission,
    getMySubmission,
} from '../../../services/tasks';

export default function StudentTasksDashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal states
    const [submitModalOpen, setSubmitModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [submissionInput, setSubmissionInput] = useState('');

    // View submission — fetched fresh when the modal opens
    const [viewSubmission, setViewSubmission] = useState(null);
    const [loadingSubmission, setLoadingSubmission] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);

    // Action loading flags
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => setToast({ message, type });

    // ── Fetch available tasks ──────────────────────────────────────────────
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getMyAvailableTasks();
            setTasks(res.tasks || []);
        } catch (err) {
            console.error('Failed to load tasks:', err);
            setError('Failed to load your assignments. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

    // ── Modal openers ──────────────────────────────────────────────────────
    const openSubmitModal = (task) => {
        setSelectedTask(task);
        setSubmissionInput('');
        setSubmitModalOpen(true);
    };

    const openViewModal = async (task) => {
        setSelectedTask(task);
        setViewSubmission(null);
        setSubmissionError(null);
        setViewModalOpen(true);
        setLoadingSubmission(true);
        try {
            const res = await getMySubmission(task.id);
            // API wraps the result: { submission: { ... } }
            setViewSubmission(res.submission ?? res);
        } catch (err) {
            console.error('Failed to fetch submission:', err);
            setSubmissionError('Could not load your submission. Please try again.');
        } finally {
            setLoadingSubmission(false);
        }
    };

    const openDeleteModal = () => {
        setViewModalOpen(false);
        setDeleteModalOpen(true);
    };

    // ── Submit / Edit handler ──────────────────────────────────────────────
    const handleSubmitTask = async (e) => {
        e.preventDefault();
        if (!submissionInput.trim()) return;

        const isEdit = !!selectedTask?.my_submission;
        setSubmitting(true);
        try {
            const res = await submitTask(selectedTask.id, submissionInput.trim());
            // Patch local state immediately — no full re-fetch needed
            setTasks(prev =>
                prev.map(t =>
                    t.id === selectedTask.id
                        ? { ...t, my_submission: res.submission }
                        : t
                )
            );
            setSubmitModalOpen(false);
            setSelectedTask(null);
            showToast(isEdit ? 'Submission updated successfully!' : 'Task submitted successfully!', 'success');
        } catch (err) {
            console.error('Submit failed:', err);
            showToast(err?.response?.data?.message || 'Failed to submit. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Delete handler ─────────────────────────────────────────────────────
    const confirmDeleteSubmission = async () => {
        setDeleting(true);
        try {
            await deleteMySubmission(selectedTask.id);
            setTasks(prev =>
                prev.map(t =>
                    t.id === selectedTask.id
                        ? { ...t, my_submission: null }
                        : t
                )
            );
            setDeleteModalOpen(false);
            setSelectedTask(null);
            showToast('Submission deleted successfully.', 'success');
        } catch (err) {
            console.error('Delete failed:', err);
            const msg = err?.response?.data?.message || 'Failed to delete submission.';
            showToast(msg, 'error');
            setDeleteModalOpen(false);
        } finally {
            setDeleting(false);
        }
    };

    // ── Derived stats ──────────────────────────────────────────────────────
    const pendingCount = tasks.filter(t => !t.my_submission).length;
    const submittedCount = tasks.filter(t => !!t.my_submission).length;

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50/50 relative">
            {/* Toast */}
            <div className="fixed top-8 right-8 z-[100] flex flex-col gap-2">
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>

            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        My Assignments
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm max-w-lg">
                        View your assigned tasks, submit your solutions, and check your grades. Keep an eye on the due dates!
                    </p>
                </div>

                {/* Metrics — only show when data has loaded */}
                {!loading && !error && (
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <div className="bg-white px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-gray-500">Pending</span>
                            <span className="text-xl font-bold text-orange-500">{pendingCount}</span>
                        </div>
                        <div className="bg-white px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-gray-500">Submitted</span>
                            <span className="text-xl font-bold text-emerald-500">{submittedCount}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 size={40} className="animate-spin text-indigo-500" />
                    <p className="text-gray-500 font-medium">Loading your assignments…</p>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-2xl border border-red-100">
                    <AlertCircle size={40} className="text-red-400" />
                    <p className="text-gray-700 font-medium">{error}</p>
                    <button
                        onClick={fetchTasks}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-2xl border border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                        <BookOpen size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No assignments yet</h3>
                    <p className="text-gray-500 text-sm max-w-sm text-center">
                        You have no available assignments at the moment. Check back later!
                    </p>
                </div>
            )}

            {/* Task Grid */}
            {!loading && !error && tasks.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <StudentTaskCard
                            key={task.id}
                            task={task}
                            openSubmitModal={openSubmitModal}
                            openViewModal={openViewModal}
                        />
                    ))}
                </div>
            )}

            {/* Submit / Edit Task Modal */}
            <StudentSubmitTaskModal
                isOpen={submitModalOpen}
                onClose={() => !submitting && setSubmitModalOpen(false)}
                selectedTask={selectedTask}
                submissionInput={submissionInput}
                setSubmissionInput={setSubmissionInput}
                onSubmit={handleSubmitTask}
                loading={submitting}
            />

            {/* View Submission Modal */}
            <StudentViewTaskModal
                isOpen={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                selectedTask={selectedTask}
                submission={viewSubmission}
                loadingSubmission={loadingSubmission}
                submissionError={submissionError}
                openDeleteModal={openDeleteModal}
            />

            {/* Delete Confirmation Modal */}
            <StudentDeleteConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => !deleting && setDeleteModalOpen(false)}
                selectedTask={selectedTask}
                confirmDeleteSubmission={confirmDeleteSubmission}
                loading={deleting}
            />
        </div>
    );
}
