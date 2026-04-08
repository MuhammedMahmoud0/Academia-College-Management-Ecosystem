import { useState, useEffect, useContext } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { getLectureGrades, getTutorialLabGrades } from '../../../services/grades';

export default function LowGradeAlertsPage() {
    const { user } = useContext(AuthContext);
    const { courseId } = useParams();
    const location = useLocation();

    const isTA = user?.role === 'teaching_assistant';
    const lectureId = location.state?.lectureId;
    const courseName = location.state?.courseName || 'Course';
    const courseCode = location.state?.courseCode || courseId;

    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState(location.state?.alerts || null);

    useEffect(() => {
        if (!lectureId) return;
        
        // If we didn't receive alerts through state, fetch them
        if (!alerts) {
            fetchAllData();
        } else {
            setLoading(false);
        }
    }, [lectureId, isTA]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const gradesRes = await (isTA ? getTutorialLabGrades(lectureId) : getLectureGrades(lectureId));
            const students = gradesRes.students || [];
            
            const atRiskStudents = [];
            students.forEach(student => {
                const gradeVal = student.grade;
                if (gradeVal && (gradeVal.startsWith('D') || gradeVal.startsWith('F'))) {
                    atRiskStudents.push({
                        full_name: student.full_name,
                        email: student.email,
                        grade: gradeVal,
                        mid_score: student.mid_score,
                        work_score: student.work_score,
                        final_score: student.final_score
                    });
                }
            });
            setAlerts(atRiskStudents);
        } catch (err) {
            console.error('Failed to load grades data', err);
            setAlerts([]);
        } finally {
            setLoading(false);
        }
    };

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
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 w-fit transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm">Back to Course Dashboard</span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Low Grade Alerts</h1>
                <p className="text-indigo-600 font-medium mt-1">{courseName} ({courseCode})</p>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">At-Risk Students Roster</h2>
                        <p className="text-sm text-gray-500">Students currently holding a D or F grade</p>
                    </div>
                    {alerts && (
                        <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm border border-red-200">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            {alerts.length} Alerts
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="p-16 flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    </div>
                ) : !alerts || alerts.length === 0 ? (
                    <div className="p-16 text-center text-gray-500 border-t border-gray-100 bg-gray-50 flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">All Clear!</h3>
                        <p className="mt-1">No students are currently at risk of failing.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {alerts.map((student, idx) => (
                            <div key={idx} className="p-6 hover:bg-red-50/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900">{student.full_name}</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">{student.email || 'No email provided'}</p>
                                        
                                        {/* Optional scores if we have them from fetching state */}
                                        {(student.mid_score !== undefined || student.final_score !== undefined) && (
                                            <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
                                                <span>Midterm: <strong className="text-gray-900">{student.mid_score ?? '-'}</strong></span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span>Course Work: <strong className="text-gray-900">{student.work_score ?? '-'}</strong></span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span>Final: <strong className="text-gray-900">{student.final_score ?? '-'}</strong></span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center shrink-0 ml-16 sm:ml-0">
                                    <span className={`inline-flex items-center justify-center font-bold px-4 py-2 rounded-lg border shadow-sm ${
                                        student.grade?.startsWith('D') 
                                            ? 'border-orange-200 bg-orange-50 text-orange-700' 
                                            : 'border-red-200 bg-red-50 text-red-700'
                                    }`}>
                                        Grade: {student.grade}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
