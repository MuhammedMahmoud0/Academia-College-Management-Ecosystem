import { Link } from 'react-router-dom';

export default function CourseCard({ courseCode, courseName, studentCount, courseId }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">{courseCode}</p>
                <h3 className="text-lg font-semibold text-gray-900">{courseName}</h3>
            </div>
            <div className="flex items-center gap-2 mb-4 text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-sm">{studentCount} Students</span>
            </div>
            <Link 
                to={`/dashboard/doctor/course/${courseId}`}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
                Manage Course
            </Link>
        </div>
    );
}
