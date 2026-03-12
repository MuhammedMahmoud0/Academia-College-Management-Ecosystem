import { useState, useEffect } from 'react';
import NeedsAttentionCard from '../components/doctors/DoctorDashboard/NeedsAttentionCard';
import CourseCard from '../components/doctors/DoctorDashboard/CourseCard';
import WeekScheduleCard from '../components/doctors/DoctorDashboard/WeekScheduleCard';
import OfficeHoursCard from '../components/doctors/DoctorDashboard/OfficeHoursCard';
import { getTeacherSchedule } from '../services/scheduleService';

export default function DoctorDashboard() {
    const [schedule, setSchedule] = useState([]);
    const [teacherName, setTeacherName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getTeacherSchedule();
                setSchedule(data.schedule || []);
                setTeacherName(data.teacherName || '');
            } catch (err) {
                setError(err?.response?.data?.error || 'Failed to load schedule.');
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    // Derive unique courses from all schedule slots
    const courses = Object.values(
        schedule
            .flatMap(({ slots = [] }) => slots)
            .reduce((acc, slot) => {
                if (!acc[slot.courseCode]) {
                    acc[slot.courseCode] = {
                        courseCode: slot.courseCode,
                        courseName: slot.courseName,
                    };
                }
                return acc;
            }, {})
    );

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
                    <NeedsAttentionCard />

                    {/* My Courses */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Courses</h2>
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2].map((i) => (
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courses.map((course) => (
                                    <CourseCard
                                        key={course.courseCode}
                                        courseId={course.courseCode}
                                        courseCode={course.courseCode}
                                        courseName={course.courseName}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    <WeekScheduleCard schedule={schedule} loading={loading} />
                    <OfficeHoursCard />
                </div>
            </div>
        </div>
    );
}
