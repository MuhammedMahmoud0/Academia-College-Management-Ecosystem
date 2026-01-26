
import CourseTableRegistration from '../components/student/StuentRegestration/CourseTable'
import AvailableCourses from '../components/student/StuentRegestration/AvailableCourses'

export default function StudentRegistrationPage() {
    return (
        <div className="w-full min-h-screen">
            <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
                <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Course Registration</h1>
                
                {/* Registered Courses Section */}
                <div className="mb-8 sm:mb-10 md:mb-12">
                    <CourseTableRegistration />
                </div>

                {/* Available Courses Section */}
                <div className="mt-8 sm:mt-10 md:mt-12">
                    <AvailableCourses />
                </div>
            </div>
        </div>
    );
}