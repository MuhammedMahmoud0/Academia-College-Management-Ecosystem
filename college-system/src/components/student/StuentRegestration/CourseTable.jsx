
import { useMemo } from 'react';
import { unregisterCourse } from '../../../services/registrationService';
import { useToast } from '../../../hooks/useToast';

// Handles both abbreviated ("Mon") and full ("Monday") day names, plus API format
const DAY_MAP = {
  Sun: 'Sunday',  Mon: 'Monday',    Tue: 'Tuesday',
  Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday',
  Sunday: 'Sunday', Monday: 'Monday', Tuesday: 'Tuesday',
  Wednesday: 'Wednesday', Thursday: 'Thursday', Friday: 'Friday', Saturday: 'Saturday',
};
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Parses both:
//   "Mon, Wed 10:00-12:00"  (legacy abbreviated multi-day)
//   "Monday 10:00-11:30"    (API single full-day)
const parseSchedule = (scheduleStr) => {
  if (!scheduleStr) return { days: [], timeSlot: '' };
  const timeMatch = scheduleStr.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  if (!timeMatch) return { days: [], timeSlot: '' };
  const timeSlot = `${timeMatch[1]} - ${timeMatch[2]}`;
  const daysStr = scheduleStr.replace(timeMatch[0], '').trim().replace(/,\s*$/, '');
  const parsedDays = daysStr.split(',').map(d => DAY_MAP[d.trim()]).filter(Boolean);
  return { days: parsedDays, timeSlot };
};

// enrolledCourses entries shape:
// { lectureId, labId, course, instructor, schedule, credits }
export default function CourseTableRegistration({ enrolledCourses = [], onRemoveCourse }) {
  const toast = useToast();
  const totalCredits = enrolledCourses.reduce((sum, row) => sum + (row.credits || 0), 0);

  // Build schedule grid data and sorted time slots from enrolled courses
  const { scheduleData, timeSlots } = useMemo(() => {
    const data = {};
    const slotsSet = new Set();
    enrolledCourses.forEach(row => {
      const { days, timeSlot } = parseSchedule(row.schedule);
      if (!timeSlot) return;
      slotsSet.add(timeSlot);
      days.forEach(day => {
        if (!data[day]) data[day] = {};
        data[day][timeSlot] = row;
      });
    });
    const sorted = [...slotsSet].sort((a, b) => {
      const aH = parseInt(a.split(':')[0]);
      const bH = parseInt(b.split(':')[0]);
      return aH - bH;
    });
    return { scheduleData: data, timeSlots: sorted };
  }, [enrolledCourses]);

  // Current week dates (Sun–Sat)
  const weekDates = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    return DAYS.map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, []);

  const handleRemove = async (course) => {
    // realLabId   : real lab section ID from GET /courses/student/labs
    // realSectionId: real lecture section ID from available-offerings match
    const apiLabId     = course.realLabId ?? null;
    const apiLectureId = course.realSectionId ??
      (typeof course.lectureId === 'number' ? course.lectureId : null);

    if (course.isLab) {
      // Lab removal: DELETE /registration/unregister with tutorialLabId only.
      // Lecture enrollment stays intact — parent will open lab re-selection.
      if (apiLabId) {
        try {
          await unregisterCourse(null, apiLabId);
        } catch (err) {
          const msg = err?.response?.data?.error || 'Failed to unregister lab. Please try again.';
          toast.error(msg, 6000);
          return;
        }
      }
      toast.success(`Lab removed. Please select a new lab for ${course.courseName ?? course.course}.`);
      onRemoveCourse?.(course, 'lab');
      return;
    }

    // Lecture removal: DELETE /registration/unregister with lectureId only.
    // Backend removes the entire course (lecture + lab) in one call.
    if (!apiLectureId) {
      // No valid lecture ID — remove locally so the UI stays clean.
      onRemoveCourse?.(course, 'lecture');
      return;
    }

    try {
      await unregisterCourse(apiLectureId, null);
      toast.success(`Unregistered from ${course.courseName ?? course.course}`);
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to unregister. Please try again.';
      toast.error(msg, 6000);
      return;
    }

    onRemoveCourse?.(course, 'lecture');
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Courses</h2>

      {enrolledCourses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-gray-400">
          <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-sm font-medium">No courses registered yet</p>
          <p className="text-xs mt-1">Add courses from the Available Courses section below</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 md:p-6 overflow-x-auto">
            <div className="grid grid-cols-7 gap-3 min-w-[900px]">
              {DAYS.map((day, dayIndex) => (
                <div key={day} className="flex flex-col">
                  {/* Day Header */}
                  <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-t-lg px-2 py-3 mb-3">
                    <h3 className="font-bold text-center text-sm">{day}</h3>
                    <p className="text-center text-xs text-gray-300 mt-1">
                      {weekDates[dayIndex].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>

                  {/* Time Slot Cells */}
                  <div className="flex flex-col gap-2.5">
                    {timeSlots.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg h-[130px] flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs">Free</span>
                      </div>
                    ) : (
                      timeSlots.map(timeSlot => {
                        const course = scheduleData[day]?.[timeSlot];
                        return (
                          <div key={`${day}-${timeSlot}`} className="min-h-[150px]">
                            {course ? (
                              <div className={`h-full rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-3 border-l-4 flex flex-col overflow-hidden ${
                                course.isLab
                                  ? 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-500'
                                  : 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-500'
                              }`}>
                                {/* Time + type badge row */}
                                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                                  <span className={`inline-block px-2 py-0.5 text-xs font-semibold text-white rounded-full whitespace-nowrap ${
                                    course.isLab ? 'bg-violet-600' : 'bg-indigo-600'
                                  }`}>
                                    {timeSlot}
                                  </span>
                                  <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${
                                    course.isLab
                                      ? 'bg-violet-100 text-violet-700'
                                      : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {course.isLab ? 'Lab' : 'Lecture'}
                                  </span>
                                </div>
                                <p className="text-xs font-bold text-indigo-900 leading-tight mb-0.5 line-clamp-1">
                                  {course.courseName ?? course.course}
                                </p>
                                <p className="text-xs text-gray-600 truncate">{course.instructor}</p>
                                {course.location && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <svg className="w-3 h-3 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-xs text-gray-500 truncate">{course.location}</span>
                                  </div>
                                )}
                                <button
                                  onClick={() => handleRemove(course)}
                                  className="mt-auto flex items-center gap-1 text-xs text-red-500 hover:text-red-700 w-fit cursor-pointer"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                  </svg>
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-gray-200 rounded-lg h-full flex flex-col items-center justify-center text-gray-400">
                                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs">Free</span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer: Total Credits */}
      <div className="flex items-center justify-end mt-6">
        <span className="font-semibold text-lg text-gray-800">
          Total Credits: {totalCredits}
        </span>
      </div>
    </div>
  );
}
