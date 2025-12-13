import React from "react";
import ScheduleCard from "../StudentSchedule/ScheduleCard.jsx";

export default function StudentSchedulePage() {
  // 1. Define your Color Map
  const timeColorMap = {
    "8:00 - 10:00":  { bg: "bg-sky-500/10",    border: "border-blue-600/70",   title: "text-blue-800" },
    "10:00 - 12:00": { bg: "bg-green-500/10",  border: "border-green-600/70",  title: "text-green-800" },
    "12:00 - 14:00": { bg: "bg-yellow-500/10", border: "border-yellow-600/70", title: "text-yellow-800" },
    "14:00 - 16:00": { bg: "bg-purple-500/10", border: "border-purple-600/70", title: "text-purple-800" },
    "16:00 - 18:00": { bg: "bg-red-500/10",    border: "border-red-600/70",    title: "text-red-800" },
    "Online":        { bg: "bg-gray-100", border: "border-gray-500", title: "text-gray-800" },
    default:         { bg: "bg-gray-100",      border: "border-gray-500",      title: "text-gray-800" },
  };

  // 2. Define the Grid Structure (7 Days)
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // 3. Define Time Slots (Rows)
  const timeSlots = [
    "8:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "Online",
  ];
  
  // 4. Define the Schedule Data
  // Organize courses by Day -> Time Slot
  const scheduleData = {
    Monday: {
      "16:00 - 18:00": { name: "Operating System", code: "CS350", location: "Hall C-105", doctor: "Dr. Smith" },
    },
    Tuesday: {
      "12:00 - 14:00": { name: "Operating System", code: "CS350", location: "Hall C-105" , doctor: "Dr. Smith" },
    },
    Wednesday: {
      "12:00 - 14:00": { name: "Operating System", code: "CS350", location: "Hall C-105", doctor: "Dr. Smith" },
    },
    Thursday: {
      "8:00 - 10:00": { name: "Operating System", code: "CS350", location: "Hall C-105", doctor: "Dr. Smith" },
      "Online": { name: "Operating System", code: "CS350", location: "Online Session", doctor: "Dr. Smith" },
    },
    Friday: {
      "8:00 - 10:00": { name: "Operating System", code: "CS350", location: "Hall C-105", doctor: "Dr. Smith" },
      "10:00 - 12:00": { name: "Operating System", code: "CS350", location: "Hall C-105", doctor: "Dr. Smith" },
      "16:00 - 18:00": { name: "Operating System", code: "CS350", location: "Hall C-105", doctor: "Dr. Smith" },
    },
    Saturday: {
      "Online": { name: "Operating System", code: "CS350", location: "Online Session", doctor: "Dr. Smith" },
    },
    Sunday: {
      "8:00 - 10:00": { name: "Operating System", code: "CS350", location: "Hall C-105", doctor: "Dr. Smith" },
      "12:00 - 14:00": { name: "Operating System", code: "CS350", location: "Hall C-105", doctor: "Dr. Smith" },
      "16:00 - 18:00": { name: "Operating System", code: "CS350", location: "Hall C-105", doctor: "Dr. Smith" },
    },
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="px-4 sm:px-6 md:px-8">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4">Weekly Schedule</h1>
      </div>

      {/* Responsive Grid Container */}
      <div className="px-4 sm:px-6 md:px-8">
        {/* Grid Container: Responsive Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5 lg:gap-4 mb-6">
          {days.map((day) => (
            <div key={day} className="flex flex-col gap-2 sm:gap-3">
              {/* Column Header */}
              <h1 className="font-bold text-center border-b-2 border-gray-500 pb-2 sm:pb-3 md:pb-4 mb-2 sm:mb-3 text-base sm:text-lg md:text-xl">
                {day}
              </h1>

              {/* Render exactly 5 Rows per column based on time slots */}
              {timeSlots.map((timeSlot) => {
                const course = scheduleData[day] && scheduleData[day][timeSlot];

                return (
                  <div key={`${day}-${timeSlot}`} className="h-full min-h-[120px] sm:min-h-[130px] md:min-h-[140px]">
                    {course ? (
                      <ScheduleCard 
                        course={{ ...course, time: timeSlot }} 
                        timeColorMap={timeColorMap} 
                      />
                    ) : (
                      // Empty Placeholder to maintain grid shape
                      <div className="border border-dashed border-gray-300 rounded-lg h-full flex items-center justify-center text-gray-400 text-sm">
                        -
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}