import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import NeedsAttentionCard from '../components/doctors/DoctorDashboard/NeedsAttentionCard';
import CourseCard from '../components/doctors/DoctorDashboard/CourseCard';
import WeekScheduleCard from '../components/doctors/DoctorDashboard/WeekScheduleCard';
import { getTeacherSchedule } from '../services/scheduleService';
import { getDoctorAlerts, getTAAlerts, getDoctorCourses } from '../services/doctorDashboard';

export default function DoctorDashboard() {
    const { user } = useContext(AuthContext);
    const [schedule, setSchedule] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [courses, setCourses] = useState([]);
    const [teacherName, setTeacherName] = useState('');
    const [loading, setLoading] = useState(true);
    const [alertsLoading, setAlertsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return; // Wait until user context is populated
        
        const fetchDashboardData = async () => {
            setLoading(true);
            setAlertsLoading(true);
            setError(null);
            
            const isTA = user.role === 'teaching_assistant';
            
            try {
                const [scheduleData, alertsData, coursesData] = await Promise.allSettled([
                    getTeacherSchedule(),
                    isTA ? getTAAlerts() : getDoctorAlerts(),
                    isTA ? Promise.resolve({ courses: [] }) : getDoctorCourses()
                ]);

                if (scheduleData.status === 'fulfilled') {
                    const sched = scheduleData.value.schedule || [];
                    setSchedule(sched);
                    setTeacherName(scheduleData.value.teacherName || '');
                    
                    if (isTA) {
                        const taAssignments = [];
                        sched.forEach(day => {
                            day.slots?.forEach(slot => {
                                taAssignments.push({
                                    courseId: slot.courseCode,
                                    courseCode: slot.courseCode,
                                    courseName: slot.courseName,
                                    studentCount: null,
                                    lecture: {
                                        lecture_id: slot.tutorialLabId,
                                        tutorial_lab_id: slot.tutorialLabId,
                                        session_type: slot.type,
                                        group: slot.type ? slot.type.toUpperCase() : 'LAB',
                                        day_of_week: day.day,
                                        start_time: slot.startTime,
                                        end_time: slot.endTime,
                                        location: slot.location
                                    }
                                });
                            });
                        });
                        setCourses(taAssignments);
                    }
                } else {
                    setError('Failed to load schedule.');
                }

                if (alertsData.status === 'fulfilled') {
                    setAlerts(alertsData.value.alerts || []);
                }

                if (coursesData.status === 'fulfilled' && !isTA) {
                    const doctorCourses = coursesData.value.courses || [];
                    const individualAssignments = [];
                    doctorCourses.forEach(course => {
                        if (course.lectures && course.lectures.length > 0) {
                            course.lectures.forEach(lec => {
                                individualAssignments.push({
                                    courseId: course.course_code,
                                    courseCode: course.course_code,
                                    courseName: course.course_name,
                                    credits: course.credits,
                                    semester: course.semester,
                                    year: course.year,
                                    lecture: lec,
                                    studentCount: lec.enrollment_count !== undefined ? lec.enrollment_count : course.total_students,
                                });
                            });
                        } else {
                            individualAssignments.push({
                                courseId: course.course_code,
                                courseCode: course.course_code,
                                courseName: course.course_name,
                                credits: course.credits,
                                semester: course.semester,
                                year: course.year,
                                studentCount: course.total_students,
                                lecture: null
                            });
                        }
                    });
                    setCourses(individualAssignments);
                }
            } catch {
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
                setAlertsLoading(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    return (
        <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl" >
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Welcome{teacherName ? `, ${teacherName}` : ''}
                </h1>
                <p className="text-gray-600">Here's your overview for the week.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Needs Attention */}
                    <NeedsAttentionCard alerts={alerts} loading={alertsLoading} />
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    <WeekScheduleCard schedule={schedule} loading={loading} />
                </div>
            </div>

            {/* My Courses - Full Width Section */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">My Courses</h2>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                                <div className="h-5 bg-gray-200 rounded w-3/4 mb-4" />
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-6" />
                                <div className="h-10 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <p className="text-gray-500 text-sm">No courses found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                        {courses.map((assignment, index) => (
                            <CourseCard
                                key={`${assignment.courseCode}-${assignment.lecture?.lecture_id || index}`}
                                {...assignment}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
