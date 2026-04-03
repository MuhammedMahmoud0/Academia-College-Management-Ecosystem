import React from 'react';
import { Edit3, Trash2, Clock, X } from 'lucide-react';

export default function StudentViewTaskModal({ isOpen, onClose, selectedTask, openEditSubmission, openDeleteModal }) {
    if (!isOpen || !selectedTask || !selectedTask.my_submission) return null;

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Your Submission</h2>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{selectedTask.title}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {selectedTask.my_submission.grade !== null ? (
                            <div className="flex flex-col items-end mr-2">
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Grade</span>
                                <span className="text-lg font-black text-emerald-600">{selectedTask.my_submission.grade}/100</span>
                            </div>   
                        ) : (
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200 mr-2">
                                Pending Review
                            </span>
                        )}
                        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>
                
                <div className="p-6 text-sm text-gray-600 font-medium">
                    <label className="block mb-2 font-semibold text-gray-900">Submitted Content:</label>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 font-mono text-sm break-all text-gray-700 min-h-[80px]">
                        {selectedTask.my_submission.submission_content}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 border-t border-gray-100 pt-4">
                        <Clock size={16} /> 
                        Submitted on: <span className="font-semibold text-gray-900">{formatDate(selectedTask.my_submission.submitted_at)}</span>
                    </div>

                    <div className="flex gap-3 mt-4">
                        {/* Edit Button */}
                        <button 
                            type="button"
                            onClick={() => openEditSubmission(selectedTask)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                        >
                            <Edit3 size={16} />
                            Edit Submission
                        </button>

                        {/* Delete Submission */}
                        {selectedTask.my_submission.grade === null && (
                            <button 
                                onClick={openDeleteModal}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-sm shadow-red-200 hover:-translate-y-0.5 transition-all"
                            >
                                <Trash2 size={16} /> Delete Submission
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
