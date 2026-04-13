import { Link } from 'react-router-dom';

export default function CourseCard({ courseCode, courseName, studentCount, courseId, lecture, credits, semester, year }) {
    
    // Convert the single assigned lecture back into an array to support the existing map structure seamlessly
    const lectures = lecture ? [lecture] : [];
    const lectureId = lecture?.lecture_id;
    const sessionType = lecture?.session_type || lecture?.type || lecture?.lecture_type || null;
    const tutorialLabId =
        lecture?.tutorial_lab_id ??
        lecture?.tutorialLabId ??
        ((sessionType === 'tutorial' || sessionType === 'lab' || sessionType === 'tutorial_lab')
            ? lecture?.lecture_id
            : null);

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const date = new Date(timeString);
        if (isNaN(date.getTime())) return timeString; // Fallback for pre-formatted strings like "10:00 AM"
        // Use UTC formatting since standard date entries like "1970-01-01T11:00:00.000Z" don't carry timezone adjustments in this context
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden flex flex-col h-full">
            {/* Header section with refined gradient */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                        {courseCode}
                    </span>
                    {(semester && year) && (
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {semester} {year}
                        </span>
                    )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight mt-1">{courseName}</h3>
                
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                    {studentCount != null && (
                        <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="font-semibold text-gray-900">{studentCount}</span> Students
                        </div>
                    )}
                    {credits != null && (
                        <div className="flex items-center gap-1.5 border-l border-gray-300 pl-4">
                            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="font-semibold text-gray-900">{credits}</span> Credits
                        </div>
                    )}
                </div>
            </div>

            {/* Lectures Settings Details */}
            <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                    {lectures.length > 0 ? (
                        <div className="space-y-4 mb-6">
                            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Scheduled Lectures</h4>
                            {lectures.map((lec) => (
                                <div key={lec.lecture_id} className="flex items-start gap-4 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <div className="w-8 h-8 rounded-md bg-white border border-gray-200 text-indigo-600 flex items-center justify-center font-bold text-xs shadow-sm">
                                            G{lec.group}
                                        </div>
                                    </div>
                                    <div className="flex-grow space-y-1">
                                        <div className="font-semibold text-gray-900">{lec.day_of_week}s</div>
                                        <div className="text-gray-500 flex items-center gap-1.5 text-xs">
                                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {formatTime(lec.start_time)} - {formatTime(lec.end_time)}
                                        </div>
                                        <div className="text-gray-500 flex items-center gap-1.5 text-xs">
                                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="truncate">{lec.location}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 italic mb-6">No scheduled lectures.</div>
                    )}
                </div>

                <Link 
                    to={`/dashboard/doctor/course/${courseId}`}
                    state={{ courseCode, courseName, lectureId, tutorialLabId, sessionType }}
                    className="w-full mt-auto group relative flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm ring-1 ring-inset ring-indigo-600 transition-all duration-200 py-3 rounded-lg font-semibold"
                >
                    Manage Course
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
