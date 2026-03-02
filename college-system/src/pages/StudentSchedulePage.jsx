import { useState, useEffect, useCallback } from 'react';
import ScheduleCard from '../components/student/StudentSchedule/ScheduleCard.jsx';
import { getStudentScheduleByWeek } from '../services/scheduleService.js';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Normalise "09:00:00" or "09:00" → "09:00"
const fmt = (t) => (t ? t.slice(0, 5) : '');

// Build a slot key like "09:00 - 10:30"
const slotKey = (cls) => `${fmt(cls.startTime)} - ${fmt(cls.endTime)}`;

// Skeleton column while loading
function SkeletonColumn() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="h-16 bg-gray-200 rounded-t-lg mb-3" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-[130px] bg-gray-100 rounded-lg mb-2.5" />
      ))}
    </div>
  );
}

export default function StudentSchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [schedule, setSchedule]     = useState([]);   // array of { day, date, classes }
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const fetchSchedule = useCallback(async (offset) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStudentScheduleByWeek(offset);
      setSchedule(data.schedule ?? []);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load schedule.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSchedule(weekOffset); }, [fetchSchedule, weekOffset]);

  // Build lookup: day → { slotKey → class }
  const scheduleMap = {};
  const timeSlotsSet = new Set();
  schedule.forEach(({ day, classes = [] }) => {
    scheduleMap[day] = {};
    classes.forEach(cls => {
      const key = slotKey(cls);
      scheduleMap[day][key] = cls;
      timeSlotsSet.add(key);
    });
  });
  const timeSlots = [...timeSlotsSet].sort((a, b) => a.localeCompare(b));

  // Build day → date label from API response
  const dateByDay = {};
  schedule.forEach(({ day, date }) => { dateByDay[day] = date; });

  // Week range label e.g. "Feb 22 – Feb 28"
  const weekLabel = (() => {
    const dates = schedule.map(d => d.date).filter(Boolean);
    if (dates.length < 2) return weekOffset === 0 ? 'Current Week' : weekOffset > 0 ? `+${weekOffset} week(s)` : `${weekOffset} week(s)`;
    const first = new Date(dates[0]);
    const last  = new Date(dates[dates.length - 1]);
    const opt   = { month: 'short', day: 'numeric' };
    return `${first.toLocaleDateString('en-US', opt)} – ${last.toLocaleDateString('en-US', opt)}`;
  })();

  return (
    <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Weekly Schedule</h1>

        {/* Week navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset(w => w - 1)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            title="Previous week"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="min-w-[160px] text-center text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg px-4 py-2">
            {weekLabel}
          </span>

          <button
            onClick={() => setWeekOffset(0)}
            disabled={weekOffset === 0}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors disabled:opacity-40 cursor-pointer"
          >
            Today
          </button>

          <button
            onClick={() => setWeekOffset(w => w + 1)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            title="Next week"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
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

      {/* Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 md:p-6 overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 min-w-[900px]">
            {loading
              ? DAYS.map(d => <SkeletonColumn key={d} />)
              : DAYS.map((day) => {
                  const dayDate = dateByDay[day];
                  const formatted = dayDate
                    ? new Date(dayDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : '';

                  return (
                    <div key={day} className="flex flex-col">
                      {/* Day header */}
                      <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-t-lg px-2 py-3 mb-3">
                        <h3 className="font-bold text-center text-sm">{day}</h3>
                        {formatted && (
                          <p className="text-center text-xs text-gray-300 mt-1">{formatted}</p>
                        )}
                      </div>

                      {/* Slots */}
                      <div className="flex flex-col gap-2.5">
                        {timeSlots.length === 0 ? (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg h-[130px] flex flex-col items-center justify-center text-gray-400">
                            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs">Free</span>
                          </div>
                        ) : (
                          timeSlots.map(slot => {
                            const cls = scheduleMap[day]?.[slot];
                            return (
                              <div key={slot} className="h-[130px]">
                                {cls ? (
                                  <ScheduleCard course={{
                                    time: slot,
                                    name: cls.courseName,
                                    code: cls.courseCode,
                                    location: cls.location,
                                    doctor: cls.instructor,
                                    type: cls.type,
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
                  );
                })
            }
          </div>
        </div>
      </div>
    </div>
  );
}