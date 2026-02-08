import {React} from 'react';
import AdminAttendanceStatsCard from '../components/admin/Attendance/AdminAttendanceStatsCard';
import StudentsAttendanceTable from '../components/admin/Attendance/StudentsAttendanceTable';
import DepartmentComparisonChart from '../components/admin/Attendance/DepartmentComparisonChart';
import AttendanceTrendLineChart from '../components/admin/Attendance/AttendanceTrendLineChart';
import AttendanceDistributionChart from '../components/admin/Attendance/AttendanceDistributionChart';
import TopPerformingStudentsChart from '../components/admin/Attendance/TopPerformingStudentsChart';

const AttendanceForAdmin = () => {

  // Mock data - replace with actual API calls
  const stats = {
    overallAttendanceRate: '92%',
    lowestAttendanceCourses: [
      { name: 'PHY101: General Physics', rate: 78 },
      { name: 'MA310: Linear Algebra', rate: 85 }
    ]
  };

  const studentsData = [
    { id: 1, name: 'Sarah Johnson', major: 'Computer Science', attendance: '98%' },
    { id: 2, name: 'David Chen', major: 'Mechanical Eng.', attendance: '95%' },
    { id: 3, name: 'Michael Brown', major: 'Computer Science', attendance: '78%' },
    { id: 4, name: 'Emily Rodriguez', major: 'Electrical Eng.', attendance: '94%' },
    { id: 5, name: 'James Martinez', major: 'Civil Eng.', attendance: '89%' },
    { id: 6, name: 'Lisa Kim', major: 'Computer Science', attendance: '92%' }
  ];

  const departmentData = [
    { department: 'CS', rate: 92 },
    { department: 'ME', rate: 88 },
    { department: 'EE', rate: 85 },
    { department: 'CE', rate: 90 }
  ];

  const trendData = [
    { month: 'Jan', rate: 88 },
    { month: 'Feb', rate: 90 },
    { month: 'Mar', rate: 92 },
    { month: 'Apr', rate: 89 },
    { month: 'May', rate: 93 },
    { month: 'Jun', rate: 91 }
  ];

  const distributionData = [
    { name: 'Excellent (90-100%)', value: 45, color: '#10b981' },
    { name: 'Good (80-89%)', value: 30, color: '#f59e0b' },
    { name: 'Fair (70-79%)', value: 15, color: '#f97316' },
    { name: 'Poor (Below 70%)', value: 10, color: '#ef4444' }
  ];

  const topStudentsData = [
    { name: 'Sarah J.', rate: 98 },
    { name: 'David C.', rate: 95 },
    { name: 'Emily R.', rate: 94 },
    { name: 'James M.', rate: 93 },
    { name: 'Lisa K.', rate: 92 }
  ];

  // const handleExportReport = () => {
  //   console.log('Exporting attendance report...');
  //   // Implement export functionality
  // };

  return (
     <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl" >
    
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Attendance Management</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor and analyze student attendance across all programs</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <AdminAttendanceStatsCard
            title="Overall Attendance Rate"
            value={stats.overallAttendanceRate}
            valueColor="text-emerald-600"
          />
          <AdminAttendanceStatsCard
            title="Courses with Lowest Attendance"
            items={stats.lowestAttendanceCourses}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AttendanceTrendLineChart data={trendData} />
          <DepartmentComparisonChart data={departmentData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AttendanceDistributionChart data={distributionData} />
          <TopPerformingStudentsChart data={topStudentsData} />
        </div>

        {/* Students Table */}
        <StudentsAttendanceTable 
          students={studentsData}
        />
      </div>
   
  );
};

export default AttendanceForAdmin;
