
import CourseTableRegistration from '../components/student/StuentRegestration/CourseTable'
import AvailableCourses from '../components/student/StuentRegestration/AvailableCourses'

export default function StudentRegistrationPage() {
    return (
             <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 ">
              <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
                    <h1 className="text-3xl font-bold text-slate-900 mb-6">Course Registration</h1>
                
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