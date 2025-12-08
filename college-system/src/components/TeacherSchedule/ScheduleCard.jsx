import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function ScheduleCard({ course, timeColorMap }) {

  const colors = timeColorMap[course.time] || timeColorMap.default;

  return (
    <div className={`h-full rounded-tr-lg rounded-br-lg shadow-xl p-2 sm:p-3 md:p-4 border-l-4 sm:border-l-5 md:border-l-7 mb-2 sm:mb-3 md:mb-4 
                     ${colors.bg} ${colors.border}`}>
      
      <div>
        <h1 className={`text-xs sm:text-sm md:text-lg font-extrabold ${colors.title} leading-tight`}>{course.name}</h1>
        <h5 className="font-thin mb-1 sm:mb-2 text-gray-800 text-xs sm:text-sm">{course.code}</h5>

        <div className="flex flex-col mt-1 sm:mt-2">
          <div className="flex mb-1 sm:mb-2 md:mb-3 gap-1 sm:gap-2 items-center text-gray-700">
            <AccessTimeIcon sx={{ fontSize: { xs: '16px', sm: '18px', md: '24px' } }} /> 
            <div className="text-xs sm:text-sm md:text-base">{course.time}</div>
          </div>

          <div className="flex gap-1 sm:gap-2 items-center text-gray-700 pb-2 sm:pb-3 md:pb-5">
            <LocationOnIcon sx={{ fontSize: { xs: '16px', sm: '18px', md: '24px' } }} /> 
            <div className="text-xs sm:text-sm md:text-base">{course.location}</div>
          </div>
        </div>
      </div>

    </div>
  );
}
