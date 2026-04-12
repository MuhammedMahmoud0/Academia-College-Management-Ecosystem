import React, { useCallback, useEffect, useState } from 'react';
import AttendanceStatsCard from '../components/student/Attendance/AttendanceStatsCard';
import AttendanceLog from '../components/student/Attendance/AttendanceLog';
import { getStudentAttendanceDashboard } from '../services/studentAttendanceDashboard';

const AttendanceForStudents = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [stats, setStats] = useState({
    attendanceRate: '0%',
    totalAbsences: '0',
    totalAttendances: '0',
  });

  const fetchAttendanceData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await getStudentAttendanceDashboard();

      const presentCount = Number(response?.present_count ?? 0);
      const absentCount = Number(response?.absent_count ?? 0);
      const percentageValue = Number(response?.attendance_percentage ?? 0);
      const attendanceRate = Number.isFinite(percentageValue)
        ? `${percentageValue.toFixed(1).replace(/\.0$/, '')}%`
        : '0%';

      setStats({
        attendanceRate,
        totalAbsences: String(absentCount),
        totalAttendances: String(presentCount),
      });

      const history = Array.isArray(response?.history) ? response.history : [];
      const flattenedRecords = history.flatMap((dayEntry, dayIndex) => {
        const sessions = Array.isArray(dayEntry?.sessions) ? dayEntry.sessions : [];

        return sessions.map((session, sessionIndex) => ({
          ...session,
          date: dayEntry?.date || '',
          record_id: session?.attendance_id ?? `${dayIndex}-${sessionIndex}`,
        }));
      });

      setAttendanceData(flattenedRecords);
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to load attendance history.';

      setErrorMessage(backendMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  return (
      <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Attendance</h1>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600 font-medium">
            Loading attendance history...
          </div>
        ) : errorMessage ? (
          <div className="bg-white rounded-lg shadow-md p-6 border border-red-100">
            <h2 className="text-lg font-semibold text-red-700 mb-2">Unable to load attendance data</h2>
            <p className="text-sm text-gray-600 mb-4">{errorMessage}</p>
            <button
              type="button"
              onClick={fetchAttendanceData}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <AttendanceStatsCard
                title="Attendance Rate"
                value={stats.attendanceRate}
                valueColor="text-blue-600"
              />
              <AttendanceStatsCard
                title="Absent Sessions"
                value={stats.totalAbsences}
                valueColor="text-red-600"
              />
              <AttendanceStatsCard
                title="Present Sessions"
                value={stats.totalAttendances}
                valueColor="text-green-600"
              />
            </div>

            <AttendanceLog attendanceData={attendanceData} />
          </>
        )}
      </div>
  );
};

export default AttendanceForStudents;
