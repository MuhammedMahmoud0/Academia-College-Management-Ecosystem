import { useState } from 'react';

export default function CourseManagementSetting() {
    const [courses] = useState([
        {
            id: 1,
            name: 'Machine Learning',
            code: 'CS462'
        },
        {
            id: 2,
            name: 'Compiler Design',
            code: 'CS421'
        }
    ]);

    const handleManageCourse = (course) => {
        console.log('Managing course:', course);
        // Add your course management logic here
    };

    return (
        <div className="w-full p-4 md:p-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                 <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Course Management</h1>
                    <p className="text-sm md:text-base text-gray-500">Manage settings for your assigned courses.</p>
                </div>

                {/* Course List */}
                <div className="space-y-4">
                    {courses.map((course, index) => (
                        <div
                            key={course.id}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 ${
                                index !== courses.length - 1 ? 'border-b border-gray-200' : ''
                            }`}
                        >
                            <div className="min-w-0">
                                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                                    {course.name}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-500">{course.code}</p>
                            </div>
                            
                            <button
                                onClick={() => handleManageCourse(course)}
                                className="px-4 md:px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs md:text-sm w-full sm:w-auto"
                            >
                                Manage
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}