import { useState, useEffect, useContext } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { 
    getGradeDistribution, 
    setGradeDistribution, 
    getLectureGrades, 
    getTutorialLabGrades, 
    updateStudentGradeForDoctor, 
    updateStudentGradeForTA 
} from '../../../services/grades';

export default function GradesManagementPage() {
    const { user } = useContext(AuthContext);
    const { courseId } = useParams();
    const location = useLocation();

    const isTA = user?.role === 'teaching_assistant';
    const lectureId = location.state?.lectureId;
    const courseName = location.state?.courseName || 'Course';
    const courseCode = location.state?.courseCode || courseId;

    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    
    // Filtering and Sorting State
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name'); // 'name' | 'grade'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
    
    // Distribution State (Doctors Only)
    const [distribution, setDistribution] = useState({ work_max: 0, mid_max: 0, final_max: 0 });
    const [tempDist, setTempDist] = useState({ work_max: 0, mid_max: 0, final_max: 0 });
    const [distEditing, setDistEditing] = useState(false);
    const [distSaving, setDistSaving] = useState(false);
    const [distError, setDistError] = useState('');
    const [distSuccess, setDistSuccess] = useState('');

    // Student Edit State map: { student_id: { mid_score, work_score, final_score, saving, error } }
    const [editMap, setEditMap] = useState({});

    useEffect(() => {
        if (!lectureId) return;
        fetchAllData();
    }, [lectureId, isTA]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const gradesRes = await (isTA ? getTutorialLabGrades(lectureId) : getLectureGrades(lectureId));
            setStudents(gradesRes.students || []);

            if (!isTA) {
                try {
                    const distRes = await getGradeDistribution(lectureId);
                    if (distRes.distribution) {
                        const initDist = {
                            work_max: distRes.distribution.work_max || 0,
                            mid_max: distRes.distribution.mid_max || 0,
                            final_max: distRes.distribution.final_max || 0
                        };
                        setDistribution(initDist);
                        setTempDist(initDist);
                    }
                } catch (err) {
                    // Ignore 404 if distribution not set yet
                    if (err.response?.status !== 404) console.error(err);
                }
            }
        } catch (err) {
            console.error('Failed to load grades data', err);
        } finally {
            setLoading(false);
        }
    };

    // Distribution Handlers
    const handleDistChange = (e) => {
        let val = Number(e.target.value);
        if (val < 0) val = 0; // Prevent negative inputs
        
        setTempDist({ ...tempDist, [e.target.name]: val });
        setDistError('');
    };

    const handleSaveDistribution = async () => {
        const sum = tempDist.work_max + tempDist.mid_max + tempDist.final_max;
        if (sum !== 100) {
            setDistError(`Validation error: values sum to ${sum}, must be 100.`);
            return;
        }

        setDistSaving(true);
        setDistError('');
        setDistSuccess('');
        try {
            await setGradeDistribution(lectureId, tempDist);
            setDistribution(tempDist);
            setDistEditing(false);
            setDistSuccess('Distribution applied successfully.');
            setTimeout(() => setDistSuccess(''), 3000);
        } catch (err) {
            setDistError(err.response?.data?.error || 'Failed to save distribution.');
        } finally {
            setDistSaving(false);
        }
    };

    // Student Grade Handlers
    const toggleEditStudent = (student) => {
        if (editMap[student.student_id]) {
            // Cancel edit
            const newMap = { ...editMap };
            delete newMap[student.student_id];
            setEditMap(newMap);
        } else {
            // Begin edit
            setEditMap({
                ...editMap,
                [student.student_id]: {
                    mid_score: student.mid_score !== null ? student.mid_score : '',
                    work_score: student.work_score !== null ? student.work_score : '',
                    final_score: student.final_score !== null ? student.final_score : '',
                    saving: false,
                    error: ''
                }
            });
        }
    };

    const handleStudentGradeChange = (studentId, field, value) => {
        // Prevent negative values from typed hyphens
        if (value !== '' && Number(value) < 0) {
            value = '0';
        }

        // Enforce maximum distribution limits (if distribution config is loaded natively)
        if (value !== '') {
            const numVal = Number(value);
            if (field === 'mid_score' && distribution.mid_max > 0 && numVal > distribution.mid_max) {
                value = String(distribution.mid_max);
            }
            if (field === 'work_score' && distribution.work_max > 0 && numVal > distribution.work_max) {
                value = String(distribution.work_max);
            }
            if (field === 'final_score' && distribution.final_max > 0 && numVal > distribution.final_max) {
                value = String(distribution.final_max);
            }
        }

        setEditMap({
            ...editMap,
            [studentId]: {
                ...editMap[studentId],
                [field]: value,
                error: ''
            }
        });
    };

    const handleSaveStudentGrade = async (studentId) => {
        const edits = editMap[studentId];
        
        // Prepare payload - convert empty strings to null or ignore them
        const payload = {};
        if (!isTA && edits.mid_score !== '') payload.mid_score = Number(edits.mid_score);
        if (edits.work_score !== '') payload.work_score = Number(edits.work_score);
        if (!isTA && edits.final_score !== '') payload.final_score = Number(edits.final_score);

        setEditMap({ ...editMap, [studentId]: { ...edits, saving: true } });

        try {
            let res;
            if (isTA) {
                res = await updateStudentGradeForTA(lectureId, studentId, payload);
            } else {
                res = await updateStudentGradeForDoctor(lectureId, studentId, payload);
            }

            // Update local student list instantly
            const updatedStudent = res.enrollment;
            setStudents(students.map(s => 
                s.student_id === studentId ? { 
                    ...s, 
                    mid_score: updatedStudent.mid_score,
                    work_score: updatedStudent.work_score,
                    final_score: updatedStudent.final_score,
                    grade: updatedStudent.grade
                } : s
            ));

            // Close edit mode
            const newMap = { ...editMap };
            delete newMap[studentId];
            setEditMap(newMap);

        } catch (err) {
            setEditMap({
                ...editMap,
                [studentId]: {
                    ...edits,
                    saving: false,
                    error: err.response?.data?.error || 'Validation failed against distribution maxes.'
                }
            });
        }
    };

    const getProcessedStudents = () => {
        let processed = [...students];

        // Search Filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            processed = processed.filter(s => 
                (s.full_name && s.full_name.toLowerCase().includes(query)) || 
                (s.email && s.email.toLowerCase().includes(query))
            );
        }

        // Sorting
        processed.sort((a, b) => {
            let valA, valB;
            if (sortBy === 'name') {
                valA = a.full_name?.toLowerCase() || '';
                valB = b.full_name?.toLowerCase() || '';
            } else if (sortBy === 'grade') {
                // For grades, smaller string means better grade string-wise (A < B). 
                // We'll map missing grades to 'Z' to dump them at the bottom naturally.
                valA = a.grade || 'Z';
                valB = b.grade || 'Z';
            }

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return processed;
    };

    const processedStudents = getProcessedStudents();

    if (!lectureId) {
        return (
            <div className="p-6 max-w-7xl mx-auto text-center mt-20">
                <h2 className="text-xl font-bold text-gray-800">Invalid Navigation Session</h2>
                <p className="text-gray-500 mt-2">Cannot determine the active group or lecture ID.</p>
                <Link to="/dashboard/doctor" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">Return to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-6">
                <Link 
                    to={`/dashboard/doctor/course/${courseId}`} 
                    state={{ courseCode, courseName, lectureId }}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 w-fit"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm">Back to Course Dashboard</span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Grades Management</h1>
                <p className="text-indigo-600 font-medium">{courseName} ({courseCode})</p>
            </div>

            {/* Top Widget: Grade Distribution (Doctors Only) */}
            {!isTA && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Grade Distribution Matrix</h2>
                            <p className="text-sm text-gray-500">Must sum to precisely 100.</p>
                        </div>
                        {!distEditing ? (
                            <button 
                                onClick={() => setDistEditing(true)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                            >
                                Edit Distribution
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => { setDistEditing(false); setTempDist(distribution); setDistError(''); }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveDistribution}
                                    disabled={distSaving}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {distSaving && (
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="p-6">
                        {distError && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm flex items-center gap-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                {distError}
                            </div>
                        )}
                        {distSuccess && (
                            <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm flex items-center gap-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                {distSuccess}
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Midterm Limit</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        name="mid_max"
                                        min="0"
                                        disabled={!distEditing}
                                        value={distEditing ? tempDist.mid_max : distribution.mid_max} 
                                        onChange={handleDistChange}
                                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors" 
                                    />
                                    <span className="absolute right-3 top-2.5 text-gray-400 text-sm">pts</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Coursework Limit</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        name="work_max"
                                        min="0"
                                        disabled={!distEditing}
                                        value={distEditing ? tempDist.work_max : distribution.work_max} 
                                        onChange={handleDistChange}
                                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors" 
                                    />
                                    <span className="absolute right-3 top-2.5 text-gray-400 text-sm">pts</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Final Exam Limit</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        name="final_max"
                                        min="0"
                                        disabled={!distEditing}
                                        value={distEditing ? tempDist.final_max : distribution.final_max} 
                                        onChange={handleDistChange}
                                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors" 
                                    />
                                    <span className="absolute right-3 top-2.5 text-gray-400 text-sm">pts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Students List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Student Roster</h2>
                        <span className="text-sm text-gray-500">{students.length} Enrolled</span>
                    </div>

                    {/* Filters and Sort */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative">
                            <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <input 
                                type="text"
                                placeholder="Search by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64 transition-colors"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-colors cursor-pointer"
                            >
                                <option value="name">Sort: Name</option>
                                <option value="grade">Sort: Grade</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                title={sortOrder === 'asc' ? "Ascending Order" : "Descending Order"}
                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white text-gray-600 transition-colors shadow-sm flex items-center justify-center"
                            >
                                {sortOrder === 'asc' ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"></path></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : processedStudents.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 border-t border-gray-100 bg-gray-50">
                        {students.length === 0 ? "No students enrolled or found in this group." : "No students match your search filter."}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-y border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Student</th>
                                    <th className="px-6 py-3 font-medium w-24 text-center">Midterm</th>
                                    <th className="px-6 py-3 font-medium w-24 text-center">Work</th>
                                    <th className="px-6 py-3 font-medium w-24 text-center">Final</th>
                                    <th className="px-6 py-3 font-medium w-24 text-center">Grade</th>
                                    <th className="px-6 py-3 font-medium w-32 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {processedStudents.map(student => {
                                    const isEditing = !!editMap[student.student_id];
                                    const editState = editMap[student.student_id];

                                    return (
                                        <tr key={student.student_id} className={`hover:bg-gray-50/50 transition-colors ${isEditing ? 'bg-indigo-50/20' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{student.full_name}</div>
                                                <div className="text-xs text-gray-500">{student.email}</div>
                                                {editState?.error && (
                                                    <div className="text-xs text-red-600 mt-1 font-medium max-w-xs truncate" title={editState.error}>
                                                        ⚠️ {editState.error}
                                                    </div>
                                                )}
                                            </td>
                                            
                                            {/* Midterm Cell */}
                                            <td className="px-6 py-4 text-center">
                                                {isEditing && !isTA ? (
                                                    <input 
                                                        type="number"
                                                        min="0"
                                                        max={distribution.mid_max > 0 ? distribution.mid_max : undefined}
                                                        className="w-16 px-2 py-1 text-center border border-indigo-300 rounded focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
                                                        value={editState.mid_score}
                                                        onChange={(e) => handleStudentGradeChange(student.student_id, 'mid_score', e.target.value)}
                                                    />
                                                ) : (
                                                    <span className={`font-mono ${student.mid_score !== null ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {student.mid_score !== null ? student.mid_score : '-'}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Course Work Cell */}
                                            <td className="px-6 py-4 text-center">
                                                {isEditing ? (
                                                    <input 
                                                        type="number"
                                                        min="0"
                                                        max={distribution.work_max > 0 ? distribution.work_max : undefined}
                                                        className="w-16 px-2 py-1 text-center border border-indigo-300 rounded focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
                                                        value={editState.work_score}
                                                        onChange={(e) => handleStudentGradeChange(student.student_id, 'work_score', e.target.value)}
                                                    />
                                                ) : (
                                                    <span className={`font-mono ${student.work_score !== null ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {student.work_score !== null ? student.work_score : '-'}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Final Exam Cell */}
                                            <td className="px-6 py-4 text-center">
                                                {isEditing && !isTA ? (
                                                    <input 
                                                        type="number"
                                                        min="0"
                                                        max={distribution.final_max > 0 ? distribution.final_max : undefined}
                                                        className="w-16 px-2 py-1 text-center border border-indigo-300 rounded focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
                                                        value={editState.final_score}
                                                        onChange={(e) => handleStudentGradeChange(student.student_id, 'final_score', e.target.value)}
                                                    />
                                                ) : (
                                                    <span className={`font-mono ${student.final_score !== null ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {student.final_score !== null ? student.final_score : '-'}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Automated Letter Grade */}
                                            <td className="px-6 py-4 text-center">
                                                {student.grade ? (
                                                    <span className={`inline-flex items-center justify-center h-6 w-6 font-bold rounded-full border ${
                                                        ['A', 'B', 'C'].includes(student.grade) 
                                                            ? 'border-indigo-200 bg-indigo-50 text-indigo-700' 
                                                            : 'border-red-200 bg-red-50 text-red-600'
                                                    }`}>
                                                        {student.grade}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                {isEditing ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => toggleEditStudent(student)}
                                                            disabled={editState.saving}
                                                            className="text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button 
                                                            onClick={() => handleSaveStudentGrade(student.student_id)}
                                                            disabled={editState.saving}
                                                            className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center min-w-[60px]"
                                                        >
                                                            {editState.saving ? (
                                                                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : 'Save'}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => toggleEditStudent(student)}
                                                        className="text-indigo-600 hover:text-indigo-900 font-medium text-sm border hover:border-indigo-200 hover:bg-indigo-50 border-transparent rounded-lg px-3 py-1.5 transition-colors"
                                                    >
                                                        Edit Marks
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
