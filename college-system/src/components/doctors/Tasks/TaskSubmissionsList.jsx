import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Search, FileText, CheckCircle,
    Clock, Edit3, User, Award, Loader2, AlertCircle,
    ExternalLink, Link2
} from 'lucide-react';
import { getTaskById, getTaskSubmissions, gradeSubmission } from '../../../services/tasks';

// ── Small helper: detect if content is a URL ────────────────────────────────
const isUrl = (text = '') => {
    try {
        const url = new URL(text.trim());
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

// ── Avatar initial — prefer full_name, fall back to student_id ─────────────
const avatarLetter = (sub) => {
    const name = sub?.users?.full_name || sub?.student_id || '';
    return name.trim().charAt(0).toUpperCase() || '?';
};

export default function TaskSubmissionsList() {
    const { taskId } = useParams();
    const navigate = useNavigate();

    // Task info (for the header)
    const [task, setTask] = useState(null);

    // Submissions from API
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');

    // Grading modal
    const [gradingModalOpen, setGradingModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradeInput, setGradeInput] = useState('');
    const [grading, setGrading] = useState(false);
    const [gradeError, setGradeError] = useState(null);

    // ── Fetch data ──────────────────────────────────────────────────────────
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [taskRes, subsRes] = await Promise.all([
                getTaskById(taskId),
                getTaskSubmissions(taskId),
            ]);
            setTask(taskRes);
            setSubmissions(subsRes.submissions || []);
        } catch (err) {
            console.error('Failed to load submissions:', err);
            setError('Failed to load submissions. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [taskId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ── Filtered list — search by name, email, or student_id ───────────────
    const filteredSubmissions = submissions.filter(sub => {
        const q = searchQuery.toLowerCase();
        return (
            (sub.users?.full_name || '').toLowerCase().includes(q) ||
            (sub.users?.email || '').toLowerCase().includes(q) ||
            (sub.student_id || '').toLowerCase().includes(q)
        );
    });

    // ── Grading handlers ───────────────────────────────────────────────────
    const openGradingModal = (submission) => {
        setSelectedSubmission(submission);
        setGradeInput(submission.grade !== null && submission.grade !== undefined ? submission.grade : '');
        setGradeError(null);
        setGradingModalOpen(true);
    };

    const handleSaveGrade = async (e) => {
        e.preventDefault();
        const numGrade = parseFloat(gradeInput);
        if (isNaN(numGrade) || numGrade < 0) {
            setGradeError('Please enter a valid grade (≥ 0).');
            return;
        }

        setGrading(true);
        setGradeError(null);
        try {
            const res = await gradeSubmission(taskId, selectedSubmission.id, numGrade);
            // Update submission in local state immediately
            setSubmissions(prev =>
                prev.map(sub =>
                    sub.id === selectedSubmission.id
                        ? { ...sub, grade: res.submission?.grade ?? numGrade }
                        : sub
                )
            );
            setGradingModalOpen(false);
            setSelectedSubmission(null);
        } catch (err) {
            console.error('Grading failed:', err);
            setGradeError(err?.response?.data?.message || 'Failed to save grade. Try again.');
        } finally {
            setGrading(false);
        }
    };

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50/50">

            {/* ── Header ── */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/dashboard/tasks')}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors mb-4"
                >
                    <ArrowLeft size={16} /> Back to Tasks
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <FileText className="text-indigo-600" size={32} />
                            Task Submissions
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {task
                                ? <>Review and grade submissions for <span className="font-semibold text-gray-700">"{task.title}"</span></>
                                : `Review and grade submissions for Task #${taskId}`}
                        </p>
                    </div>

                    {/* Stats */}
                    {!loading && !error && (
                        <div className="flex gap-4">
                            <div className="bg-white px-4 py-2 border border-gray-200 rounded-xl shadow-sm text-center min-w-[72px]">
                                <div className="text-2xl font-bold text-gray-800">{submissions.length}</div>
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</div>
                            </div>
                            <div className="bg-emerald-50 px-4 py-2 border border-emerald-100 rounded-xl shadow-sm text-center min-w-[72px]">
                                <div className="text-2xl font-bold text-emerald-700">
                                    {submissions.filter(s => s.grade !== null && s.grade !== undefined).length}
                                </div>
                                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Graded</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Loading ── */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 size={40} className="animate-spin text-indigo-500" />
                    <p className="text-gray-500 font-medium">Loading submissions…</p>
                </div>
            )}

            {/* ── Error ── */}
            {!loading && error && (
                <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-2xl border border-red-100">
                    <AlertCircle size={40} className="text-red-400" />
                    <p className="text-gray-700 font-medium">{error}</p>
                    <button
                        onClick={fetchData}
                        className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* ── Content ── */}
            {!loading && !error && (
                <>
                    {/* Toolbar */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                        <div className="relative w-full sm:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or student ID…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submission Content</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted At</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredSubmissions.length > 0 ? (
                                        filteredSubmissions.map((sub) => {
                                            const isLink = isUrl(sub.submission_content || '');
                                            const isGraded = sub.grade !== null && sub.grade !== undefined;

                                            return (
                                                <tr key={sub.id} className="hover:bg-indigo-50/30 transition-colors">
                                                    {/* Student */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            {/*Avatar*/}
                                                            {sub.avatar_url ? (
                                                                <img
                                                                    src={sub.avatar_url}
                                                                    alt={sub.users?.full_name || 'Student'}
                                                                    className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-indigo-100"
                                                                    onError={(e) => {
                                                                        // Fallback to initials div if image fails to load
                                                                        e.currentTarget.style.display = 'none';
                                                                        e.currentTarget.nextSibling.style.display = 'flex';
                                                                    }}
                                                                />
                                                            ) : null}
                                                            <div
                                                                className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0"
                                                                style={{ display: sub.avatar_url ? 'none' : 'flex' }}
                                                            >
                                                                {sub.users?.full_name?.charAt(0).toUpperCase() || 'U'}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-gray-900">
                                                                    {sub?.full_name || 'Unknown Student'}
                                                                </div>
                                                                <div className="text-xs text-gray-400 flex items-center gap-1 font-mono mt-0.5">
                                                                    <User size={11} />
                                                                    {sub.student_id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Email */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {sub.email ? (
                                                            <a
                                                                href={`mailto:${sub.email}`}
                                                                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline underline-offset-2 transition-colors"
                                                            >
                                                                {sub.email}
                                                            </a>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">—</span>
                                                        )}
                                                    </td>

                                                    {/* Submission content */}
                                                    <td className="px-6 py-4 max-w-xs">
                                                        {isLink ? (
                                                            <a
                                                                href={sub.submission_content.trim()}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline underline-offset-2 transition-colors"
                                                            >
                                                                <ExternalLink size={14} />
                                                                Open Link
                                                            </a>
                                                        ) : (
                                                            /* Plain text — try auto-link any URL-like substring */
                                                            <SubmissionText content={sub.submission_content} />
                                                        )}
                                                    </td>

                                                    {/* Submitted at */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-700 flex items-center gap-1.5">
                                                            <Clock size={14} className="text-gray-400 shrink-0" />
                                                            {formatDate(sub.submitted_at)}
                                                        </div>
                                                    </td>

                                                    {/* Grade badge */}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {isGraded ? (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                                <CheckCircle size={14} /> {sub.grade}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                                                <Clock size={14} /> Pending
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <button
                                                            onClick={() => openGradingModal(sub)}
                                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:text-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm"
                                                        >
                                                            <Edit3 size={15} />
                                                            {isGraded ? 'Update Grade' : 'Grade'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center gap-3 text-gray-400">
                                                    <FileText size={36} />
                                                    <p className="font-medium text-gray-600">
                                                        {searchQuery
                                                            ? 'No submissions match your search.'
                                                            : 'No submissions yet for this task.'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* ── Grading Modal ── */}
            {gradingModalOpen && selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => !grading && setGradingModalOpen(false)}
                    />
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal header */}
                        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                <Award size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Grade Submission</h2>
                                <p className="text-sm font-semibold text-gray-700">
                                    {selectedSubmission.users?.full_name || 'Unknown Student'}
                                </p>
                                {selectedSubmission.users?.email && (
                                    <p className="text-xs text-gray-400">{selectedSubmission.users.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Submission preview */}
                        <div className="px-6 pt-4">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Submission</p>
                            {isUrl(selectedSubmission.submission_content || '') ? (
                                <a
                                    href={selectedSubmission.submission_content.trim()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-indigo-600 hover:underline text-sm font-medium"
                                >
                                    <Link2 size={13} /> Open Link
                                </a>
                            ) : (
                                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2.5 border border-gray-100 line-clamp-3">
                                    {selectedSubmission.submission_content}
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleSaveGrade} className="p-6 pt-4">
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Numeric Grade
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    required
                                    autoFocus
                                    value={gradeInput}
                                    onChange={(e) => { setGradeInput(e.target.value); setGradeError(null); }}
                                    placeholder="e.g. 85.5"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-lg font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                                />
                                {gradeError && (
                                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                                        <AlertCircle size={14} /> {gradeError}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    disabled={grading}
                                    onClick={() => setGradingModalOpen(false)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={grading}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-200 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    {grading ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : 'Save Grade'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Inline component: render plain text but auto-link any URL found inside ──
function SubmissionText({ content = '' }) {
    // Split text into URL and non-URL parts
    const URL_REGEX = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(URL_REGEX);

    return (
        <span className="text-sm text-gray-600">
            {parts.map((part, i) =>
                URL_REGEX.test(part) ? (
                    <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:underline hover:text-indigo-800 transition-colors"
                    >
                        <ExternalLink size={12} />
                        {part}
                    </a>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
}
