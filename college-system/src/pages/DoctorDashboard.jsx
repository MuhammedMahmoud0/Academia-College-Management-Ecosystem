import NeedsAttentionCard from '../components/doctors/DoctorDashboard/NeedsAttentionCard';
import CourseCard from '../components/doctors/DoctorDashboard/CourseCard';
import WeekScheduleCard from '../components/doctors/DoctorDashboard/WeekScheduleCard';
import OfficeHoursCard from '../components/doctors/DoctorDashboard/OfficeHoursCard';

export default function DoctorDashboard() {
    const courses = [
        {
            id: 'cs421',
            courseCode: 'CS421',
            courseName: 'Compiler Design',
            studentCount: 45
        },
        {
            id: 'cs386',
            courseCode: 'CS386',
            courseName: 'Cybersecurity',
            studentCount: 53
        }
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Dr. Evelyn Reed</h1>
                <p className="text-gray-600">Here's your overview for the week.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Needs Attention */}
                    <NeedsAttentionCard />

                    {/* My Courses */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">My Courses</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {courses.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    courseId={course.id}
                                    courseCode={course.courseCode}
                                    courseName={course.courseName}
                                    studentCount={course.studentCount}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    <WeekScheduleCard />
                    <OfficeHoursCard />
                </div>
            </div>
        </div>
    );
}
