import React from 'react';
import { Trash2, Clock, X, ExternalLink, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

// Detect if the entire content string is a URL
const isUrl = (text = '') => {
    try {
        const url = new URL(text.trim());
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

// Render plain text, auto-linking any URL-like substrings found inside
function SubmissionContent({ content = '' }) {
    const URL_REGEX = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(URL_REGEX);
    return (
        <span className="text-sm text-gray-700 break-all leading-relaxed">
            {parts.map((part, i) =>
                URL_REGEX.test(part) ? (
                    <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:underline underline-offset-2 transition-colors"
                    >
                        <ExternalLink size={13} />
                        {part}
                    </a>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
}

export default function StudentViewTaskModal({
    isOpen,
    onClose,
    selectedTask,
    submission,           // full submission object from getMySubmission
    loadingSubmission,    // true while fetching
    submissionError,      // error string if fetch failed
    openDeleteModal,
}) {
    if (!isOpen || !selectedTask) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    // Delete allowed only BEFORE the due date
    const isPastDue = selectedTask.due_date
        ? new Date() > new Date(selectedTask.due_date)
        : false;

    const isGraded = submission?.grade !== null && submission?.grade !== undefined;
    const content = submission?.submission_content || '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">

                {/* ── Header ── */}
                <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Your Submission</h2>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{selectedTask.title}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Grade / pending badge — only when data is ready */}
                        {!loadingSubmission && submission && (
                            isGraded ? (
                                <div className="flex flex-col items-end mr-2">
                                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Grade</span>
                                    <span className="text-lg font-black text-emerald-600">{submission.grade}/100</span>
                                </div>
                            ) : (
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200 mr-2">
                                    Pending Review
                                </span>
                            )
                        )}
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="p-6">

                    {/* Loading */}
                    {loadingSubmission && (
                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                            <Loader2 size={28} className="animate-spin text-indigo-500" />
                            <p className="text-sm text-gray-500 font-medium">Loading your submission…</p>
                        </div>
                    )}

                    {/* Error */}
                    {!loadingSubmission && submissionError && (
                        <div className="flex flex-col items-center justify-center py-8 gap-3">
                            <AlertCircle size={28} className="text-red-400" />
                            <p className="text-sm font-medium text-gray-600">{submissionError}</p>
                        </div>
                    )}

                    {/* Content */}
                    {!loadingSubmission && !submissionError && submission && (
                        <>
                            <label className="block mb-2 text-sm font-semibold text-gray-900">
                                Submitted Content:
                            </label>

                            {/* Full URL → clickable link block */}
                            {isUrl(content) ? (
                                <a
                                    href={content.trim()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-700 font-medium text-sm hover:bg-indigo-100 transition-colors mb-6 break-all"
                                >
                                    <ExternalLink size={16} className="shrink-0" />
                                    <span>{content.trim()}</span>
                                </a>
                            ) : (
                                /* Plain text (with optional inline URLs auto-linked) */
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 min-h-[80px]">
                                    {content
                                        ? <SubmissionContent content={content} />
                                        : <span className="text-sm text-gray-400 italic">No content provided.</span>
                                    }
                                </div>
                            )}

                            {/* Submitted at */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 border-t border-gray-100 pt-4 mb-6">
                                <Clock size={15} className="text-gray-400 shrink-0" />
                                Submitted on:{' '}
                                <span className="font-semibold text-gray-800">
                                    {formatDate(submission.submitted_at)}
                                </span>
                            </div>

                            {/* Delete — only before due date */}
                            {!isPastDue ? (
                                <button
                                    onClick={openDeleteModal}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 shadow-sm shadow-red-200 hover:-translate-y-0.5 transition-all"
                                >
                                    <Trash2 size={16} />
                                    Delete &amp; Re-submit
                                </button>
                            ) : (
                                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                                    <CheckCircle size={14} className="text-gray-400 shrink-0" />
                                    Due date has passed — submission is locked.
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
