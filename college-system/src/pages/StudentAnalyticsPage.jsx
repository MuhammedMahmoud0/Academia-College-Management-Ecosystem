import InfoCard from "../components/student/Student Analytics/InfoCard";
import GPA_LineChart from "../components/student/Student Analytics/LineChart";
import DonutChart from "../components/student/Student Analytics/DonutChart";
import GradesDistribution from "../components/student/Student Analytics/BarCart";
import RecentActivity from "../components/student/Student Analytics/RecentActivity";

export default function StudentAnalyticsPage() {
  return (
    <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        Student Analytics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title="GPA" value="3.8" />
        <InfoCard title="Attendance Rate" value="95%" />
        <InfoCard title="Credits Completed" value="90 / 140" />
      </div>

      <div className="flex flex-col lg:flex-row items-stretch justify-between space-y-4 lg:space-y-0 lg:space-x-4 mt-8">
        <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-2/3">
          <GPA_LineChart />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-1/3">
          <DonutChart isAnimationActive={true} defaultIndex={0}/>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch justify-between space-y-4 lg:space-y-0 lg:space-x-4 mt-8">
        <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-1/2">
          <GradesDistribution />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 w-full lg:w-1/2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
