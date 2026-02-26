import React from "react";
import ScheduleCard from "../components/student/StudentSchedule/ScheduleCard.jsx";

export default function StudentSchedulePage() {
  // Define the Grid Structure (7 Days)
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Define Time Slots
  const timeSlots = [
    "8:00 - 10:00",
    "10:00 - 12:00",
    "12:00 - 14:00",
    "14:00 - 16:00",
    "16:00 - 18:00",
    "Online",
  ];
  
  // Define the Schedule Data
  const scheduleData = {
    Sunday: {
      "8:00 - 10:00": { name: "Operating System", code: "CS350", location: "Hall C-105", doctor: "Dr. Smith" },
      "12:00 - 14:00": { name: "Operating System", code: "CS350", location: "Hall C-105", doctor: "Dr. Smith" },
      "16:00 - 18:00": { name: "Operating System", code: "CS350", location: "Hall C-105", doctor: "Dr. Smith" },
    },
    Monday: {
      "16:00 - 18:00": { name: "Operating System", code: "CS350", location: "Hall C-105", doctor: "Dr. Smith" },
    },
    Tuesday: {
      "12:00 - 14:00": { name: "Operating System", code: "CS350", location: "Hall C-105", doctor: "Dr. Smith" },
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
  };

  // Generate dates for the current week
  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    
    return days.map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return date;
    });
  };

  const weekDates = getCurrentWeekDates();

  return (
    <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Weekly Schedule</h1>

      {/* Schedule Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 md:p-6">
          {/* Grid Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
            {days.map((day, dayIndex) => (
              <div key={day} className="flex flex-col">
                {/* Day Header */}
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-t-lg px-3 py-3 mb-3">
                  <h3 className="font-bold text-center text-base md:text-lg">
                    {day}
                  </h3>
                  <p className="text-center text-xs text-gray-300 mt-1">
                    {weekDates[dayIndex].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>

                {/* Classes Container */}
                <div className="flex flex-col gap-2.5">
                  {timeSlots.map((timeSlot) => {
                    const course = scheduleData[day] && scheduleData[day][timeSlot];
                    
                    return (
                      <div key={`${day}-${timeSlot}`} className="h-[130px]">
                        {course ? (
                          <ScheduleCard course={{ ...course, time: timeSlot }} />
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg h-[130px] flex flex-col items-center justify-center text-gray-400">
                            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs">Free</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}