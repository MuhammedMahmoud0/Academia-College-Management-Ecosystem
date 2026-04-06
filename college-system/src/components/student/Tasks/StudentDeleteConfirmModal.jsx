import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function StudentDeleteConfirmModal({
    isOpen, onClose, selectedTask,
    confirmDeleteSubmission, loading = false
}) {
    if (!isOpen || !selectedTask) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                onClick={() => !loading && onClose()}
            />
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle size={24} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Submission?</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to delete your submission for{' '}
                    <span className="font-semibold text-gray-700">{selectedTask.title}</span>?{' '}
                    This action cannot be undone.
                </p>
                <div className="flex gap-3 mt-4">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDeleteSubmission}
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading
                            ? <><Loader2 size={15} className="animate-spin" /> Deleting…</>
                            : 'Yes, Delete'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
