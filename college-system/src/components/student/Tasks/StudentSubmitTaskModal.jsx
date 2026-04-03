import React from 'react';
import { UploadCloud, Link as LinkIcon, AlertCircle, X } from 'lucide-react';

export default function StudentSubmitTaskModal({ isOpen, onClose, selectedTask, submissionInput, setSubmissionInput, onSubmit }) {
    if (!isOpen || !selectedTask) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {selectedTask.my_submission ? 'Edit Submission' : 'Submit Task'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{selectedTask.title}</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={onSubmit} className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <LinkIcon size={16} className="text-indigo-500" />
                            Submission Link / Content
                        </label>
                        <textarea 
                            rows={4}
                            required
                            value={submissionInput}
                            onChange={(e) => setSubmissionInput(e.target.value)}
                            placeholder="Paste your GitHub repository link, drive link, or plain text solution here..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none shadow-inner"
                        />
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <AlertCircle size={12} /> Make sure your links are public or accessible to the instructor.
                        </p>
                    </div>

                    <button 
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-200 hover:-translate-y-0.5 transition-all"
                    >
                        <UploadCloud size={18} /> Confirm {selectedTask.my_submission ? 'Edit' : 'Submission'}
                    </button>
                </form>
            </div>
        </div>
    );
}
