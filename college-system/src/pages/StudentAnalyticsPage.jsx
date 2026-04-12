import { useCallback, useEffect, useState } from "react";
import InfoCard from "../components/student/Student Analytics/InfoCard";
import GPA_LineChart from "../components/student/Student Analytics/LineChart";
import DonutChart from "../components/student/Student Analytics/DonutChart";
import GradesDistribution from "../components/student/Student Analytics/BarCart";
import RecentActivity from "../components/student/Student Analytics/RecentActivity";
import { getMyCgpaTrend, getMyGradeDistribution } from "../services/grades";
import { getStudentAttendanceDashboard } from "../services/studentAttendanceDashboard";
import { getNotifications } from "../services/notifications";

export default function StudentAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [currentCgpa, setCurrentCgpa] = useState(null);
  const [creditsCompleted, setCreditsCompleted] = useState(0);
  const [cgpaTrend, setCgpaTrend] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({
    percentage: 0,
    presentCount: 0,
    totalSessions: 0,
  });
  const [recentNotifications, setRecentNotifications] = useState([]);

  const loadStudentAnalytics = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    const [cgpaResult, distributionResult, attendanceResult, notificationsResult] = await Promise.allSettled([
      getMyCgpaTrend(),
      getMyGradeDistribution(),
      getStudentAttendanceDashboard(),
      getNotifications({ page: 1, limit: 5 }),
    ]);

    const failures = [];

    if (cgpaResult.status === "fulfilled") {
      const payload = cgpaResult.value || {};
      const trend = Array.isArray(payload?.trend) ? payload.trend : [];

      const normalizedTrend = trend.map((item, index) => {
        const semester = item?.semester || `Semester ${index + 1}`;
        const year = item?.year ? ` ${item.year}` : "";
        return {
          semester: `${semester}${year}`,
          GPA: Number(item?.cumulative_cgpa ?? 0),
        };
      });

      const computedCredits = trend.reduce((sum, item) => sum + (Number(item?.credits_earned) || 0), 0);
      const parsedCgpa = Number(payload?.current_cgpa);

      setCgpaTrend(normalizedTrend);
      setCreditsCompleted(computedCredits);
      setCurrentCgpa(Number.isFinite(parsedCgpa) ? parsedCgpa : null);
    } else {
      failures.push("CGPA trend");
    }

    if (distributionResult.status === "fulfilled") {
      const payload = distributionResult.value || {};
      const distribution = Array.isArray(payload?.distribution) ? payload.distribution : [];
      setGradeDistribution(distribution);
    } else {
      failures.push("grade distribution");
    }

    if (attendanceResult.status === "fulfilled") {
      const payload = attendanceResult.value || {};

      setAttendanceSummary({
        percentage: Number(payload?.attendance_percentage ?? 0),
        presentCount: Number(payload?.present_count ?? 0),
        totalSessions: Number(payload?.total_sessions ?? 0),
      });
    } else {
      failures.push("attendance");
    }

    if (notificationsResult.status === "fulfilled") {
      const payload = notificationsResult.value || {};
      const notifications = Array.isArray(payload?.notifications) ? payload.notifications : [];
      setRecentNotifications(notifications.slice(0, 5));
    } else {
      failures.push("recent activity");
    }

    if (failures.length > 0) {
      setErrorMessage(`Some data sections failed to load: ${failures.join(", ")}.`);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadStudentAnalytics();
  }, [loadStudentAnalytics]);

  const gpaValue =
    currentCgpa == null
      ? isLoading
        ? "..."
        : "N/A"
      : currentCgpa.toFixed(2).replace(/\.00$/, "");

  const creditsValue = isLoading ? "..." : `${creditsCompleted} Credits`;

  return (
    <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Student Analytics</h1>
        <p className="text-sm text-slate-600 mt-1">Track your performance and progress across semesters.</p>
      </div>

      {errorMessage && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm">{errorMessage}</p>
          <button
            type="button"
            onClick={loadStudentAnalytics}
            className="px-3 py-1.5 text-sm rounded-lg bg-amber-100 hover:bg-amber-200 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InfoCard title="CGPA" value={gpaValue} />
        <InfoCard title="Credits Completed" value={creditsValue} />
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 xl:col-span-8">
          <GPA_LineChart trendData={cgpaTrend} loading={isLoading} />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 xl:col-span-4">
          <DonutChart
            percentage={Number.isFinite(attendanceSummary.percentage) ? Number(attendanceSummary.percentage.toFixed(1)) : 0}
            attended={attendanceSummary.presentCount}
            total={attendanceSummary.totalSessions}
            isAnimationActive={!isLoading}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 xl:col-span-7">
          <GradesDistribution distributionData={gradeDistribution} loading={isLoading} />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 xl:col-span-5">
          <RecentActivity activities={recentNotifications} loading={isLoading} />
        </div>
      </section>
    </div>
  );
}
