export default function ScheduleClassCard({ classData, onEdit, onDelete }) {
  const isLecture = classData.type === 'lecture';
  
  // Modern color scheme based on type
  const colors = isLecture 
    ? { 
        bg: 'bg-gradient-to-br from-indigo-50 to-blue-50', 
        border: 'border-indigo-500',
        badge: 'bg-indigo-600',
        text: 'text-indigo-900'
      }
    : { 
        bg: 'bg-gradient-to-br from-emerald-50 to-teal-50', 
        border: 'border-emerald-500',
        badge: 'bg-emerald-600',
        text: 'text-emerald-900'
      };

  return (
    <div className={`relative h-[165px] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-3 border-l-4 ${colors.bg} ${colors.border} group flex flex-col overflow-hidden`}>
      {/* Action Buttons - Show on Hover */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEdit(classData)}
          className="p-1.5 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors"
          title="Edit"
        >
          <svg className="w-4 h-4 text-gray-600 hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(classData)}
          className="p-1.5 bg-white rounded-md shadow-sm hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <svg className="w-4 h-4 text-gray-600 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Type Badge */}
      <div className="mb-2">
        <span className={`inline-block px-2 py-0.5 text-xs font-semibold text-white rounded-full ${colors.badge}`}>
          {isLecture ? 'Lecture' : 'Lab'}
        </span>
      </div>

      {/* Course Info */}
      <div className="mb-2 flex-shrink-0">
        <h3 className={`text-sm font-bold ${colors.text} leading-tight mb-1 line-clamp-2`}>
          {classData.courseName}
        </h3>
        <p className="text-xs font-medium text-gray-600 truncate">
          {classData.courseCode}
        </p>
      </div>

      {/* Time */}
      <div className="flex items-start gap-1.5 mb-1.5 text-gray-700">
        <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs font-medium truncate">
          {classData.startTime?.substring(0, 5)} - {classData.endTime?.substring(0, 5)}
        </span>
      </div>

      {/* Location */}
      <div className="flex items-start gap-1.5 mb-1.5 text-gray-700">
        <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-xs font-medium truncate">
          {classData.location}
        </span>
      </div>

      {/* Instructor */}
      <div className="flex items-start gap-1.5 text-gray-700">
        <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="text-xs font-medium truncate">
          {classData.instructor}
        </span>
      </div>
    </div>
  );
}
