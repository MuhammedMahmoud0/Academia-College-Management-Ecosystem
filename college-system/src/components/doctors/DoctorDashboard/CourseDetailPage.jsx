import { Link, useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CourseDetailPage() {
    const { courseId } = useParams();

    // Mock data for student performance
    const performanceData = [
        { grade: 'A', count: 10 },
        { grade: 'B', count: 18 },
        { grade: 'C', count: 8 },
        { grade: 'D', count: 4 }
    ];

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
                <h1 className="text-3xl font-bold text-gray-900">Compiler Design</h1>
                <p className="text-indigo-600 font-medium">CS421</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Student Performance Chart */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Performance</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="grade" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Assignment Management */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment Management</h2>
                        <button className="w-full border-2 border-dashed border-gray-300 text-indigo-600 py-4 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                            + Create New Assignment
                        </button>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* At-Risk Students */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">At-Risk Students</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-700">Student X</span>
                                <span className="text-sm text-red-600 font-medium">Grade: D+</span>
                            </div>
                        </div>
                    </div>

                    {/* Attendance */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance</h2>
                        <Link 
                            to={`/dashboard/doctor/course/${courseId}/attendance`}
                            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Take Today's Attendance
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
