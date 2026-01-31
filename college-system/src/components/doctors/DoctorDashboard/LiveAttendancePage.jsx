import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';

export default function LiveAttendancePage() {
    const { courseId } = useParams();
    const [presentStudents, setPresentStudents] = useState([16, 19, 33, 34]);
    const totalStudents = 40;

    const allStudents = Array.from({ length: totalStudents }, (_, i) => i + 1);

    const toggleAttendance = (studentId) => {
        if (presentStudents.includes(studentId)) {
            setPresentStudents(presentStudents.filter(id => id !== studentId));
        } else {
            setPresentStudents([...presentStudents, studentId]);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Link 
                    to={`/dashboard/doctor/course/${courseId}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 w-fit"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm">Back to Course</span>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Live Attendance</h1>
                <p className="text-indigo-600 font-medium">Compiler Design</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* QR Code Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Scan to Mark Attendance</h2>
                    <div className="flex flex-col items-center mb-6">
                        {/* QR Code Placeholder */}
                        <div className="w-64 h-64 bg-white border-4 border-gray-900 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-full h-full p-4" viewBox="0 0 100 100" fill="black">
                                {/* Simple QR-like pattern */}
                                <rect x="0" y="0" width="20" height="20" />
                                <rect x="80" y="0" width="20" height="20" />
                                <rect x="0" y="80" width="20" height="20" />
                                <rect x="40" y="10" width="5" height="5" />
                                <rect x="50" y="10" width="5" height="5" />
                                <rect x="35" y="20" width="5" height="5" />
                                <rect x="45" y="25" width="5" height="5" />
                                <rect x="55" y="20" width="5" height="5" />
                                <rect x="40" y="35" width="5" height="5" />
                                <rect x="50" y="40" width="5" height="5" />
                                <rect x="60" y="35" width="5" height="5" />
                                <rect x="30" y="45" width="5" height="5" />
                                <rect x="45" y="50" width="5" height="5" />
                                <rect x="65" y="45" width="5" height="5" />
                                <rect x="35" y="60" width="5" height="5" />
                                <rect x="50" y="65" width="5" height="5" />
                                <rect x="60" y="60" width="5" height="5" />
                                <rect x="40" y="75" width="5" height="5" />
                                <rect x="55" y="75" width="5" height="5" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-500">New QR code in <span className="font-semibold">21s</span></p>
                    </div>
                    <button className="cursor-pointer w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors">
                        End Session
                    </button>
                </div>

                {/* Student Roster */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Student Roster ({presentStudents.length} / {totalStudents})
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Present Students */}
                        <div>
                            <h3 className="text-sm font-semibold text-green-600 mb-3">
                                Present ({presentStudents.length})
                            </h3>
                            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                {allStudents
                                    .filter(id => presentStudents.includes(id))
                                    .map((studentId) => (
                                        <div 
                                            key={studentId}
                                            className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-gray-700">Student {studentId}</span>
                                            </div>
                                            <button 
                                                onClick={() => toggleAttendance(studentId)}
                                                className="cursor-pointer text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                            >
                                                Mark Absent
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Absent Students */}
                        <div>
                            <h3 className="text-sm font-semibold text-red-600 mb-3">
                                Absent ({totalStudents - presentStudents.length})
                            </h3>
                            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                                {allStudents
                                    .filter(id => !presentStudents.includes(id))
                                    .map((studentId) => (
                                        <div 
                                            key={studentId}
                                            className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-gray-700">Student {studentId}</span>
                                            </div>
                                            <button 
                                                onClick={() => toggleAttendance(studentId)}
                                                className="cursor-pointer text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                            >
                                                Mark Present
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
