import React, { useState } from 'react';
import Toast from '../../Toast/Toast';

// Extracted Components
import StudentTaskCard from './StudentTaskCard';
import StudentSubmitTaskModal from './StudentSubmitTaskModal';
import StudentViewTaskModal from './StudentViewTaskModal';
import StudentDeleteConfirmModal from './StudentDeleteConfirmModal';

const mockAvailableTasks = [
    {
        id: 1,
        title: "Assignment 1: Linked Lists",
        description: "Implement a singly linked list with insert, delete, and search operations. Ensure memory is managed properly without leaks.",
        due_date: "2026-04-10T23:59:00.000Z",
        lecture_id: 101,
        tutorial_lab_id: null,
        created_at: "2026-04-03T18:52:09.162Z",
        my_submission: {
            id: 10,
            task_id: 1,
            student_id: "3fa85f64-5717...",
            submission_content: "https://github.com/my-repo/assignment-1",
            submitted_at: "2026-04-03T18:52:09.162Z",
            grade: 85.5
        }
    },
    {
        id: 2,
        title: "Lab 3: Binary Trees",
        description: "Create a binary search tree and perform in-order, pre-order, and post-order traversals. Write tests for each scenario.",
        due_date: "2026-04-15T23:59:00.000Z",
        lecture_id: null,
        tutorial_lab_id: 205,
        created_at: "2026-04-01T10:00:00.000Z",
        my_submission: null
    },
    {
        id: 3,
        title: "Midterm Project Proposal",
        description: "Submit a 2-page proposal for your midterm project. Include team members, chosen tech stack, and timeline.",
        due_date: "2026-04-20T12:00:00.000Z",
        lecture_id: 102,
        tutorial_lab_id: null,
        created_at: "2026-04-02T14:30:00.000Z",
        my_submission: null
    }
];

export default function StudentTasksDashboard() {
    const [tasks, setTasks] = useState(mockAvailableTasks);
    
    // UI States
    const [submitModalOpen, setSubmitModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [submissionInput, setSubmissionInput] = useState('');
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const openSubmitModal = (task) => {
        setSelectedTask(task);
        setSubmissionInput('');
        setSubmitModalOpen(true);
    };

    const openEditSubmission = (task) => {
        setSelectedTask(task);
        if (task.my_submission) setSubmissionInput(task.my_submission.submission_content);
        setViewModalOpen(false);
        setSubmitModalOpen(true);
    };

    const openViewModal = (task) => {
        setSelectedTask(task);
        setViewModalOpen(true);
    };

    const openDeleteModal = () => {
        setViewModalOpen(false);
        setDeleteModalOpen(true);
    };

    const handleSubmitTask = (e) => {
        e.preventDefault();
        const isEdit = !!selectedTask.my_submission;
        
        // Mock POST /tasks/{taskId}/submit or Edit logic
        const newSubmission = {
            id: isEdit ? selectedTask.my_submission.id : Math.floor(Math.random() * 1000) + 100,
            task_id: selectedTask.id,
            student_id: "3fa85f64-user...",
            submission_content: submissionInput,
            submitted_at: new Date().toISOString(),
            grade: isEdit ? selectedTask.my_submission.grade : null
        };
        
        setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, my_submission: newSubmission } : t));
        setSubmitModalOpen(false);
        setSelectedTask(null);
        showToast(isEdit ? 'Submission updated successfully!' : 'Task submitted successfully!', 'success');
    };

    const confirmDeleteSubmission = () => {
        // Mock DELETE /tasks/{taskId}/my-submission
        setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, my_submission: null } : t));
        setDeleteModalOpen(false);
        setSelectedTask(null);
        showToast('Submission deleted successfully.', 'success');
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50/50 relative">
            {/* Contextual Toast Notification Area */}
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
                
                {/* Metrics */}
                <div className="flex gap-3 mt-4 md:mt-0">
                    <div className="bg-white px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-4">
                        <span className="text-sm font-medium text-gray-500">Pending</span>
                        <span className="text-xl font-bold text-orange-500">{tasks.filter(t => !t.my_submission).length}</span>
                    </div>
                    <div className="bg-white px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-4">
                        <span className="text-sm font-medium text-gray-500">Submitted</span>
                        <span className="text-xl font-bold text-emerald-500">{tasks.filter(t => t.my_submission).length}</span>
                    </div>
                </div>
            </div>

            {/* Task Grid */}
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

            {/* Submit / Edit Task Modal */}
            <StudentSubmitTaskModal 
                isOpen={submitModalOpen} 
                onClose={() => setSubmitModalOpen(false)}
                selectedTask={selectedTask}
                submissionInput={submissionInput}
                setSubmissionInput={setSubmissionInput}
                onSubmit={handleSubmitTask}
            />

            {/* View Submission Modal */}
            <StudentViewTaskModal 
                isOpen={viewModalOpen} 
                onClose={() => setViewModalOpen(false)}
                selectedTask={selectedTask}
                openEditSubmission={openEditSubmission}
                openDeleteModal={openDeleteModal}
            />

            {/* Custom Delete Confirmation Modal */}
            <StudentDeleteConfirmModal 
                isOpen={deleteModalOpen} 
                onClose={() => setDeleteModalOpen(false)}
                selectedTask={selectedTask}
                confirmDeleteSubmission={confirmDeleteSubmission}
            />
        </div>
    );
}
