import React from 'react';
import { Calendar, Clock, CheckCircle2, UploadCloud, Eye } from 'lucide-react';

export default function StudentTaskCard({ task, openSubmitModal, openViewModal }) {
    const isSubmitted = !!task.my_submission;

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusColor = (dueDateStr) => {
        const due = new Date(dueDateStr).getTime();
        const now = new Date().getTime();
        const daysLeft = (due - now) / (1000 * 3600 * 24);
        
        if (daysLeft < 0) return 'text-red-600 bg-red-50 border-red-200';
        if (daysLeft < 3) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 hover:shadow-indigo-100/50 transition-all duration-300 flex flex-col overflow-hidden relative">
            {/* Decorative Top Line */}
            <div className={`h-1.5 w-full ${isSubmitted ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}></div>
            
            {/* Is Submitted Badge */}
            {isSubmitted && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 shadow-sm">
                    <CheckCircle2 size={14} />
                    Done
                </div>
            )}

            <div className="p-6 flex-1 flex flex-col">
                <span className={`self-start px-2.5 py-1 rounded-md text-xs font-bold mb-3 ${task.lecture_id ? 'bg-blue-50 text-blue-700' : 'bg-fuchsia-50 text-fuchsia-700'}`}>
                    {task.lecture_id ? `Lecture #${task.lecture_id}` : `Lab #${task.tutorial_lab_id}`}
                </span>
                
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 pr-12 line-clamp-2">
                    {task.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">
                    {task.description}
                </p>

                <div className="mt-auto border-t border-gray-100 pt-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                            <Calendar size={14} className="text-gray-400" />
                            Assigned
                        </span>
                        <span className="text-gray-700 font-medium">{new Date(task.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className={`flex items-center justify-between text-sm p-2 rounded-lg border ${getStatusColor(task.due_date)}`}>
                        <span className="flex items-center gap-1.5 font-semibold">
                            <Clock size={16} />
                            Due By
                        </span>
                        <span className="font-bold">{formatDate(task.due_date)}</span>
                    </div>
                    
                    {/* Grade Snippet (if submitted & graded) */}
                    {isSubmitted && task.my_submission.grade !== null && (
                        <div className="flex items-center justify-between text-sm px-3 py-2 mt-1 rounded-lg bg-emerald-50 border border-emerald-100">
                            <span className="font-semibold text-emerald-800">Final Grade</span>
                            <span className="font-bold text-emerald-600 bg-white px-2 py-0.5 rounded shadow-sm">{task.my_submission.grade} / 100</span>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Action Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                {isSubmitted ? (
                    <button 
                        onClick={() => openViewModal(task)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 hover:text-indigo-600 transition-all shadow-sm"
                    >
                        <Eye size={16} />
                        View My Submission
                    </button>
                ) : (
                    <button 
                        onClick={() => openSubmitModal(task)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all hover:-translate-y-0.5"
                    >
                        <UploadCloud size={16} />
                        Submit Solution
                    </button>
                )}
            </div>
        </div>
    );
}
