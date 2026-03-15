import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AttendanceSummaryCards from "../components/student/Student Attendance Details/AttendanceSummaryCards";
import AttendanceHistoryTable from "../components/student/Student Attendance Details/AttendanceHistoryTable";
import { getStudentAttendanceHistory } from "../services/studentAttendanceDetails";
import { useAuth } from "../hooks/useAuth";

const initialAttendanceState = {
  total_sessions: 0,
  present_count: 0,
  absent_count: 0,
  attendance_percentage: 0,
  history: [],
};

function formatTime(timeString) {
  const date = new Date(timeString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function StudentAttendanceDetails() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [attendanceResponse, setAttendanceResponse] =
    useState(initialAttendanceState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await getStudentAttendanceHistory();
        setAttendanceResponse({
          total_sessions: data?.total_sessions ?? 0,
          present_count: data?.present_count ?? 0,
          absent_count: data?.absent_count ?? 0,
          attendance_percentage: data?.attendance_percentage ?? 0,
          history: Array.isArray(data?.history) ? data.history : [],
        });
      } catch (fetchError) {
        const statusCode = fetchError?.response?.status || fetchError?.status;

        if (statusCode === 401) {
          logout();
          navigate("/login", { replace: true });
          return;
        }

        const message =
          fetchError?.response?.data?.message ||
          "Failed to load attendance details. Please try again.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceHistory();
  }, []);

  const rows = useMemo(() => {
    return attendanceResponse.history.flatMap((entry) =>
      entry.sessions.map((session) => ({
        id: session.attendance_id,
        date: entry.date,
        course: session.course_name,
        courseCode: session.course_code,
        group: session.group,
        sessionType: session.session_type,
        day: session.day_of_week,
        location: session.location,
        startTime: formatTime(session.start_time),
        endTime: formatTime(session.end_time),
        status: session.status,
      }))
    );
  }, [attendanceResponse.history]);

  return (
    <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Attendance Details</h1>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <AttendanceSummaryCards
        totalSessions={attendanceResponse.total_sessions}
        presentCount={attendanceResponse.present_count}
        attendancePercentage={attendanceResponse.attendance_percentage}
        absentCount={attendanceResponse.absent_count}
      />

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-8 text-center text-slate-600">
          Loading attendance details...
        </div>
      ) : (
        <AttendanceHistoryTable rows={rows} />
      )}
    </div>
  );
}