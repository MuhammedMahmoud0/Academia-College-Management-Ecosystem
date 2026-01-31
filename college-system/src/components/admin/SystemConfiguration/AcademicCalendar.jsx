import React, { useState } from 'react';

const AcademicCalendar = () => {
  const [calendarData, setCalendarData] = useState({
    semesterStart: '2025-09-01',
    registrationDeadline: '2025-09-15',
    midtermExamsBegin: '2025-10-20',
    holidayNationalDay: '2025-10-06',
    semesterEnd: '2025-12-20'
  });

  const handleInputChange = (field, value) => {
    setCalendarData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveCalendar = () => {
    console.log('Saving calendar:', calendarData);
    // Add API call here to save the calendar
    alert('Calendar saved successfully!');
  };

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Academic Calendar</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Set key dates for the current academic semester.</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {/* Semester Start */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <label className="text-gray-700 font-medium text-sm sm:text-base">Semester Start</label>
          <input
            type="date"
            value={calendarData.semesterStart}
            onChange={(e) => handleInputChange('semesterStart', e.target.value)}
            className="border border-gray-300 rounded-md px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto text-sm sm:text-base"
          />
        </div>

        {/* Registration Deadline */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <label className="text-gray-700 font-medium text-sm sm:text-base">Registration Deadline</label>
          <input
            type="date"
            value={calendarData.registrationDeadline}
            onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
            className="border border-gray-300 rounded-md px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto text-sm sm:text-base"
          />
        </div>

        {/* Mid-term Exams Begin */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <label className="text-gray-700 font-medium text-sm sm:text-base">Mid-term Exams Begin</label>
          <input
            type="date"
            value={calendarData.midtermExamsBegin}
            onChange={(e) => handleInputChange('midtermExamsBegin', e.target.value)}
            className="border border-gray-300 rounded-md px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto text-sm sm:text-base"
          />
        </div>

        {/* Holiday: National Day */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <label className="text-gray-700 font-medium text-sm sm:text-base">Holiday: National Day</label>
          <input
            type="date"
            value={calendarData.holidayNationalDay}
            onChange={(e) => handleInputChange('holidayNationalDay', e.target.value)}
            className="border border-gray-300 rounded-md px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto text-sm sm:text-base"
          />
        </div>

        {/* Semester End */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <label className="text-gray-700 font-medium text-sm sm:text-base">Semester End</label>
          <input
            type="date"
            value={calendarData.semesterEnd}
            onChange={(e) => handleInputChange('semesterEnd', e.target.value)}
            className="border border-gray-300 rounded-md px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6 sm:mt-8">
        <button
          onClick={handleSaveCalendar}
          className="bg-indigo-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium w-full sm:w-auto text-sm sm:text-base"
        >
          Save Calendar
        </button>
      </div>
    </div>
  );
};

export default AcademicCalendar;
