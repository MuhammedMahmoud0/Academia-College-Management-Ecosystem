import { useState, useEffect } from 'react';
import ScheduleCard from "../components/doctors/TeacherSchedule/ScheduleCard";
import { getTeacherSchedule } from '../services/scheduleService';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Format time "09:00:00" or "09:00 AM" → "09:00 AM"
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  // If already has AM/PM, return as is
  if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
  // Otherwise, just return the first 5 chars (HH:mm)
  return timeStr.slice(0, 5);
};

// Build a slot key like "09:00 AM - 10:30 AM"
const slotKey = (slot) => `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`;

// Skeleton column while loading
function SkeletonColumn() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="h-16 bg-gray-200 rounded-t-lg mb-3" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-[120px] bg-gray-100 rounded-lg mb-2.5" />
      ))}
    </div>
  );
}

export default function TeacherSchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [teacherName, setTeacherName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTeacherSchedule();
      setSchedule(data.schedule || []);
      setTeacherName(data.teacherName || '');
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load schedule.');
    } finally {
      setLoading(false);
    }
  };

  // Build lookup: day → { slotKey → slot }
  const scheduleMap = {};
  const timeSlotsSet = new Set();
  
  schedule.forEach(({ day, slots = [] }) => {
    scheduleMap[day] = {};
    slots.forEach(slot => {
      const key = slotKey(slot);
      scheduleMap[day][key] = slot;
      timeSlotsSet.add(key);
    });
  });

  const timeSlots = [...timeSlotsSet].sort((a, b) => a.localeCompare(b));

  // Generate dates for current week for display
  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    
    return DAYS.map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return date;
    });
  };

  const weekDates = getCurrentWeekDates();

  return (
    <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6">
      {/* Page Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Weekly Schedule
          {teacherName && <span className="text-xl text-gray-600 ml-3">({teacherName})</span>}
        </h1>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Schedule Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 md:p-6 overflow-x-auto">
          {/* Grid Container */}
          <div className="grid grid-cols-7 gap-3 min-w-[900px]">
            {loading
              ? DAYS.map(d => <SkeletonColumn key={d} />)
              : DAYS.map((day, dayIndex) => (
                  <div key={day} className="flex flex-col">
                    {/* Day Header */}
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-t-lg px-2 py-3 mb-3">
                      <h3 className="font-bold text-center text-sm">{day}</h3>
                      <p className="text-center text-xs text-gray-300 mt-1">
                        {weekDates[dayIndex].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    {/* Slots */}
                    <div className="flex flex-col gap-2.5">
                      {timeSlots.length === 0 ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg h-[120px] flex flex-col items-center justify-center text-gray-400">
                          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs">No classes this week</span>
                        </div>
                      ) : (
                        timeSlots.map(slot => {
                          const slotData = scheduleMap[day]?.[slot];
                          return (
                            <div key={slot} className="h-[120px]">
                              {slotData ? (
                                <ScheduleCard course={{
                                  time: slot,
                                  name: slotData.courseName,
                                  code: slotData.courseCode,
                                  location: slotData.location,
                                  type: slotData.type,
                                }} />
                              ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg h-full flex flex-col items-center justify-center text-gray-400">
                                  <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}