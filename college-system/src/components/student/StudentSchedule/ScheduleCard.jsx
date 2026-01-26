import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function ScheduleCard({ course, timeColorMap }) {

  const colors = timeColorMap[course.time] || timeColorMap.default;

  return (
    <div className={`h-full rounded-tr-lg rounded-br-lg shadow-lg hover:shadow-xl transition-shadow p-3 sm:p-4 md:p-5 border-l-4 md:border-l-[6px] mb-2 sm:mb-3 
                     ${colors.bg} ${colors.border}`}>
      
      <div>
        <h1 className={`text-sm sm:text-base md:text-lg font-bold ${colors.title} leading-tight mb-1`}>{course.name}</h1>
        <h5 className="font-medium mb-2 sm:mb-3 text-gray-600 text-xs sm:text-sm">{course.code}</h5>

        <div className="flex flex-col gap-1.5 sm:gap-2">
          <div className="flex gap-2 items-center text-gray-700">
            <AccessTimeIcon sx={{ fontSize: { xs: '18px', sm: '20px', md: '22px' } }} /> 
            <div className="text-xs sm:text-sm md:text-base font-medium">{course.time}</div>
          </div>

          <div className="flex gap-2 items-center text-gray-700">
            <LocationOnIcon sx={{ fontSize: { xs: '18px', sm: '20px', md: '22px' } }} /> 
            <div className="text-xs sm:text-sm md:text-base font-medium">{course.location}</div>
          </div>
          {course.doctor && (
            <div className="flex gap-2 items-center text-gray-700 mb-10">
              <div className="text-xs sm:text-sm md:text-base font-medium">{course.doctor}</div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
