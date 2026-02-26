export default function ScheduleCard({ course }) {
  // Modern color scheme based on course type or time
  const colors = { 
    bg: 'bg-gradient-to-br from-indigo-50 to-blue-50', 
    border: 'border-indigo-500',
    badge: 'bg-indigo-600',
    text: 'text-indigo-900'
  };

  return (
    <div className={`h-[130px] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-3 border-l-4 ${colors.bg} ${colors.border} flex flex-col overflow-hidden`}>
      {/* Time Badge */}
      <div className="mb-2">
        <span className={`inline-block px-2 py-0.5 text-xs font-semibold text-white rounded-full ${colors.badge}`}>
          {course.time}
        </span>
      </div>

      {/* Course Info */}
      <div className="mb-2 flex-shrink-0">
        <h3 className={`text-sm font-bold ${colors.text} leading-tight mb-1 line-clamp-2`}>
          {course.name}
        </h3>
        <p className="text-xs font-medium text-gray-600 truncate">
          {course.code}
        </p>
      </div>

      {/* Location */}
      <div className="flex items-start gap-1.5 mb-1.5 text-gray-700">
        <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-xs font-medium truncate">
          {course.location}
        </span>
      </div>

      {/* Doctor */}
      {course.doctor && (
        <div className="flex items-start gap-1.5 text-gray-700">
          <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs font-medium truncate">
            {course.doctor}
          </span>
        </div>
      )}
    </div>
  );
}
