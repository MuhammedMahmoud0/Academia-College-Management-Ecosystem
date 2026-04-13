import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Link, useParams, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getLectureGrades, getTutorialLabGrades } from '../../../services/grades';

const GRADE_COLORS = {
    'A': '#10b981', // emerald-500 (Excellent)
    'B': '#3b82f6', // blue-500 (Good)
    'C': '#f59e0b', // amber-500 (Average)
    'D': '#f97316', // orange-500 (Poor)
    'F': '#ef4444', // red-500 (Fail)
};

const getGradeColor = (grade) => {
    if (!grade) return '#cbd5e1';
    const baseGrade = grade.charAt(0).toUpperCase();
    return GRADE_COLORS[baseGrade] || '#cbd5e1';
};

const POSSIBLE_GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];

export default function CourseDetailPage() {
    const { user } = useContext(AuthContext);
    const { courseId } = useParams();
    const location = useLocation();

    // Context passed from the dashboard card
    const [courseDetails] = useState({
        courseCode: location.state?.courseCode || courseId,
        courseName: location.state?.courseName || 'Course Detail',
        lectureId: location.state?.lectureId || null,
        tutorialLabId: location.state?.tutorialLabId || null,
        sessionType: location.state?.sessionType || null,
    });

    const [performanceData, setPerformanceData] = useState([]);
    const [gradingStats, setGradingStats] = useState({ marked: 0, unmarked: 0 });
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const isTA = user?.role === 'teaching_assistant';
                
                // Fetch contextually depending on TA or Doctor
                let gradesRes;
                if (!courseDetails.lectureId) {
                    gradesRes = { students: [] };
                } else if (isTA) {
                    gradesRes = await getTutorialLabGrades(courseDetails.lectureId).catch(() => ({ students: [] }));
                } else {
                    gradesRes = await getLectureGrades(courseDetails.lectureId).catch(() => ({ students: [] }));
                }

                const students = gradesRes.students || [];

                // 1. Array structures for performance calculations
                const metrics = [
                    { name: 'Midterm', score: 0, count: 0 },
                    { name: 'Course Work', score: 0, count: 0 },
                    { name: 'Final Exam', score: 0, count: 0 },
                ];

                const gradeCounts = {};
                POSSIBLE_GRADES.forEach(g => gradeCounts[g] = 0);
                
                const atRiskStudents = [];

                students.forEach(student => {
                    // Collect scores
                    if (student.mid_score !== null && student.mid_score !== undefined && student.mid_score !== '') {
                        const mid = Number(student.mid_score);
                        if (!isNaN(mid)) { metrics[0].score += mid; metrics[0].count++; }
                    }
                    if (student.work_score !== null && student.work_score !== undefined && student.work_score !== '') {
                        const work = Number(student.work_score);
                        if (!isNaN(work)) { metrics[1].score += work; metrics[1].count++; }
                    }
                    if (student.final_score !== null && student.final_score !== undefined && student.final_score !== '') {
                        const final = Number(student.final_score);
                        if (!isNaN(final)) { metrics[2].score += final; metrics[2].count++; }
                    }

                    // Tally Grades
                    const gradeVal = student.grade;
                    if (gradeVal) {
                        // Initialize it if it's uniquely strange, but ideally catches A+ etc.
                        if (gradeCounts[gradeVal] === undefined) {
                            gradeCounts[gradeVal] = 0;
                        }
                        gradeCounts[gradeVal]++;
                        
                        // Collect D and F alerts
                        if (gradeVal.startsWith('D') || gradeVal.startsWith('F')) {
                            atRiskStudents.push({
                                full_name: student.full_name,
                                email: student.email,
                                grade: gradeVal
                            });
                        }
                    }
                });

                // Set combined analytics manually from local aggregation
                setAnalyticsData({
                    grade_breakdown: Object.keys(gradeCounts).map(g => ({ grade: g, count: gradeCounts[g] })),
                    low_grade_alerts: {
                        count: atRiskStudents.length,
                        students: atRiskStudents
                    }
                });

                // Calculate grading stats (a student is marked if they have ANY score or grade)
                const markedStudents = students.filter(s => 
                    (s.grade !== null && s.grade !== undefined && s.grade !== '') || 
                    (s.final_score !== null && s.final_score !== undefined && s.final_score !== '') ||
                    (s.mid_score !== null && s.mid_score !== undefined && s.mid_score !== '') ||
                    (s.work_score !== null && s.work_score !== undefined && s.work_score !== '')
                ).length;

                setGradingStats({
                    marked: markedStudents,
                    unmarked: students.length - markedStudents
                });

                // Format for Recharts safely
                const formattedData = metrics.map(m => ({
                    name: m.name,
                    average: m.count > 0 ? Number((m.score / m.count).toFixed(1)) : 0
                }));

                // Check if we actually have any scored data
                const hasData = formattedData.some(d => d.average > 0);
                
                setPerformanceData(hasData ? formattedData : []);
            } catch (err) {
                console.error("Failed to load course details data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [courseDetails.lectureId, courseDetails.courseCode]);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Link 
                    to="/dashboard/doctor" 
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 w-fit"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm">Back to Dashboard</span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">{courseDetails.courseName}</h1>
                <p className="text-indigo-600 font-medium">{courseDetails.courseCode}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Student Performance Chart */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h2 className="text-lg font-semibold text-gray-900">Class Performance Averages</h2>
                            {!loading && (
                                <div className="flex items-center gap-4 text-sm bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                        <span className="text-gray-600">Marked: <strong className="text-gray-900">{gradingStats.marked}</strong></span>
                                    </div>
                                    <div className="w-px h-4 bg-gray-300"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                                        <span className="text-gray-600">Not Marked: <strong className="text-gray-900">{gradingStats.unmarked}</strong></span>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {loading ? (
                            <div className="h-[300px] flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : performanceData.length === 0 ? (
                            <div className="h-[300px] flex items-center justify-center text-gray-500">
                                No numeric score data available.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={performanceData} margin={{ top: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <RechartsTooltip 
                                        cursor={{fill: 'transparent'}} 
                                        formatter={(value) => [`${value} Points`, 'Class Average']}
                                    />
                                    <Bar 
                                        dataKey="average" 
                                        fill="#6366f1" 
                                        radius={[8, 8, 0, 0]} 
                                        name="Average Score" 
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Grade Distribution Overview */}
                    {analyticsData && analyticsData.grade_breakdown && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Grade Distribution Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Bar Chart for Grades */}
                                <div className="h-[250px]">
                                    <h3 className="text-sm font-medium text-gray-500 text-center mb-2">Count by Grade</h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={analyticsData.grade_breakdown} margin={{ top: 10 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="grade" />
                                            <YAxis allowDecimals={false} />
                                            <RechartsTooltip cursor={{fill: 'transparent'}} />
                                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                                {analyticsData.grade_breakdown.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={getGradeColor(entry.grade)} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                
                                {/* Pie Chart for Grades */}
                                <div className="h-[250px] relative">
                                    <h3 className="text-sm font-medium text-gray-500 text-center mb-2">Grade Composition</h3>
                                    {analyticsData.grade_breakdown.every(item => item.count === 0) ? (
                                        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                                            No grades assigned yet
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={analyticsData.grade_breakdown.filter(item => item.count > 0)}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="count"
                                                    nameKey="grade"
                                                    label={({ grade, percent }) => `${grade} ${(percent * 100).toFixed(0)}%`}
                                                    labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                                                >
                                                    {analyticsData.grade_breakdown.filter(item => item.count > 0).map((entry, index) => (
                                                        <Cell key={`pie-cell-${index}`} fill={getGradeColor(entry.grade)} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip />
                                                <Legend 
                                                    iconType="circle" 
                                                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} 
                                                    payload={analyticsData.grade_breakdown.filter(item => item.count > 0).map(entry => ({
                                                        id: entry.grade,
                                                        type: 'circle',
                                                        value: entry.grade,
                                                        color: getGradeColor(entry.grade)
                                                    }))}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Low Grade Alerts */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-semibold text-gray-900">Low Grade Alerts</h2>
                                {analyticsData?.low_grade_alerts?.count > 0 && (
                                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                                        {analyticsData.low_grade_alerts.count}
                                    </span>
                                )}
                            </div>
                            <Link
                                to={`/dashboard/doctor/course/${courseId}/alerts`}
                                state={{ 
                                    courseCode: courseDetails.courseCode, 
                                    courseName: courseDetails.courseName, 
                                    lectureId: courseDetails.lectureId,
                                    alerts: analyticsData?.low_grade_alerts?.students || []
                                }}
                                className="p-1 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                title="View All Alerts"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </Link>
                        </div>
                        
                        <div className="space-y-3">
                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex space-x-3 items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                            <div className="h-6 w-8 bg-gray-200 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : analyticsData?.low_grade_alerts?.students?.length > 0 ? (
                                analyticsData.low_grade_alerts.students.slice(-3).map((student, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-red-50 p-3 rounded-lg border border-red-100">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{student.full_name}</p>
                                            <p className="text-xs text-gray-500">{student.email || 'No email'}</p>
                                        </div>
                                        <span className="text-sm text-red-600 font-bold bg-white px-2 py-1 rounded border border-red-200 shadow-sm">
                                            {student.grade}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-lg p-4 text-center">
                                    No low grade alerts (D or F) yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Attendance */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance</h2>
                        <Link 
                            to={`/dashboard/doctor/course/${courseId}/attendance`}
                            state={{
                                courseCode: courseDetails.courseCode,
                                courseName: courseDetails.courseName,
                                lectureId: courseDetails.lectureId,
                                tutorialLabId: courseDetails.tutorialLabId,
                                sessionType: courseDetails.sessionType,
                            }}
                            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Take Today's Attendance
                        </Link>
                    </div>

                    {/* Grades Management */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Grades</h2>
                        <Link 
                            to={`/dashboard/doctor/course/${courseId}/grades`}
                            state={{ courseCode: courseDetails.courseCode, courseName: courseDetails.courseName, lectureId: courseDetails.lectureId }}
                            className="w-full bg-white border border-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Manage Students Grades
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
