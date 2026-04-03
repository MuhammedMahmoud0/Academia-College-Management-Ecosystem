import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Search, FileText, CheckCircle, 
    Clock, Edit3, User, Award, ExternalLink 
} from 'lucide-react';

// Mock Submissions Data
const initialSubmissions = [
    {
        id: 10,
        task_id: 1,
        student_id: "STU-2024-001",
        student_name: "Ahmed Ali",
        submission_content: "https://github.com/ahmed/linked-list-assignment",
        submitted_at: "2026-04-03T18:40:05.950Z",
        grade: 85.5
    },
    {
        id: 11,
        task_id: 1,
        student_id: "STU-2024-045",
        student_name: "Sara Mahmoud",
        submission_content: "Attached zip file with tests passing.",
        submitted_at: "2026-04-05T10:15:20.100Z",
        grade: null
    },
    {
        id: 12,
        task_id: 1,
        student_id: "STU-2024-089",
        student_name: "Omar Youssef",
        submission_content: "https://drive.google.com/file/d/...",
        submitted_at: "2026-04-09T23:55:00.000Z",
        grade: 92.0
    }
];

export default function TaskSubmissionsList() {
    const { taskId } = useParams();
    const navigate = useNavigate();
    
    const [submissions, setSubmissions] = useState(initialSubmissions);
    const [searchQuery, setSearchQuery] = useState('');
    const [gradingModalOpen, setGradingModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradeInput, setGradeInput] = useState('');

    const filteredSubmissions = submissions.filter(sub => 
        sub.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.student_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openGradingModal = (submission) => {
        setSelectedSubmission(submission);
        setGradeInput(submission.grade !== null ? submission.grade : '');
        setGradingModalOpen(true);
    };

    const handleSaveGrade = (e) => {
        e.preventDefault();
        const numGrade = parseFloat(gradeInput);
        
        setSubmissions(submissions.map(sub => 
            sub.id === selectedSubmission.id 
                ? { ...sub, grade: numGrade } 
                : sub
        ));
        
        setGradingModalOpen(false);
        setSelectedSubmission(null);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50/50">
            {/* Header */}
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
                            Review and grade submissions for Task #{taskId}
                        </p>
                    </div>
                    
                    {/* Stats Snippet */}
                    <div className="flex gap-4">
                        <div className="bg-white px-4 py-2 border border-gray-200 rounded-xl shadow-sm text-center">
                            <div className="text-2xl font-bold text-gray-800">{submissions.length}</div>
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</div>
                        </div>
                        <div className="bg-emerald-50 px-4 py-2 border border-emerald-100 rounded-xl shadow-sm text-center">
                            <div className="text-2xl font-bold text-emerald-700">
                                {submissions.filter(s => s.grade !== null).length}
                            </div>
                            <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Graded</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by student ID or name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submission Content</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted At</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSubmissions.length > 0 ? (
                                filteredSubmissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-indigo-50/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                    {sub.student_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{sub.student_name}</div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                                        <User size={12} /> {sub.student_id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate">
                                            {sub.submission_content.startsWith('http') ? (
                                                <a href={sub.submission_content} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1.5 hover:underline">
                                                    <ExternalLink size={14} /> Provide Link
                                                </a>
                                            ) : (
                                                <span className="text-sm text-gray-600 truncate block">
                                                    {sub.submission_content}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700 flex items-center gap-1.5">
                                                <Clock size={14} className="text-gray-400" />
                                                {formatDate(sub.submitted_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {sub.grade !== null ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                    <CheckCircle size={14} /> {sub.grade}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                                    <Clock size={14} /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button 
                                                onClick={() => openGradingModal(sub)}
                                                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:text-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm"
                                            >
                                                <Edit3 size={16} />
                                                {sub.grade !== null ? 'Update Grade' : 'Grade'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No submissions found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Grading Modal */}
            {gradingModalOpen && selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setGradingModalOpen(false)}></div>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <Award size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Grade Submission</h2>
                                <p className="text-xs text-gray-500">{selectedSubmission.student_name}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSaveGrade} className="p-6">
                            <div className="mb-6">
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
                                    onChange={(e) => setGradeInput(e.target.value)}
                                    placeholder="e.g. 85.5"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-lg font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setGradingModalOpen(false)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-200 hover:-translate-y-0.5 transition-all"
                                >
                                    Save Grade
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
