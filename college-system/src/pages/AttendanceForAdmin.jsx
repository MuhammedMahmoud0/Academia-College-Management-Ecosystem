import React, { useState, useEffect } from 'react';
import AdminAttendanceStatsCard from '../components/admin/Attendance/AdminAttendanceStatsCard';
import StudentsAttendanceTable from '../components/admin/Attendance/StudentsAttendanceTable';
import DepartmentComparisonChart from '../components/admin/Attendance/DepartmentComparisonChart';
import AttendanceTrendLineChart from '../components/admin/Attendance/AttendanceTrendLineChart';
import AttendanceDistributionChart from '../components/admin/Attendance/AttendanceDistributionChart';
import TopPerformingStudentsChart from '../components/admin/Attendance/TopPerformingStudentsChart';

import { getOverallAttendanceRate, getLowestAttendanceCourses } from '../services/adminAttendanceDashboard';
import { getAllDepartments } from '../services/departments';
import { getAllCourses } from '../services/courseService';

const AttendanceForAdmin = () => {
  const [overallRateData, setOverallRateData] = useState(null);
  const [lowestCourses, setLowestCourses] = useState([]);
  const [loadingOverall, setLoadingOverall] = useState(true);
  const [loadingLowest, setLoadingLowest] = useState(true);

  // Global filters for all charts
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchGlobalOptions = async () => {
      try {
        const [deptRes, courseRes] = await Promise.all([
          getAllDepartments(),
          getAllCourses()
        ]);
        if (deptRes && deptRes.departments) {
          setDepartments(deptRes.departments.map(d => ({ value: d.department_id, label: d.name })));
        }
        if (courseRes && courseRes.courses) {
          setCourses(courseRes.courses.map(c => ({ value: c.code, label: `${c.code}: ${c.name}` })));
        }
      } catch (e) {
        console.error("Failed to load filter options", e);
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchGlobalOptions();
  }, []);

  useEffect(() => {
    const fetchOverallRate = async () => {
      try {
        const data = await getOverallAttendanceRate();
        setOverallRateData(data);
      } catch (err) {
        console.error('Error fetching overall attendance rate:', err);
      } finally {
        setLoadingOverall(false);
      }
    };

    const fetchLowestCourses = async () => {
      try {
        const data = await getLowestAttendanceCourses(5);
        setLowestCourses(data.courses || []);
      } catch (err) {
        console.error('Error fetching lowest courses:', err);
      } finally {
        setLoadingLowest(false);
      }
    };

    fetchOverallRate();
    fetchLowestCourses();
  }, []);

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
            value={loadingOverall ? '...' : (overallRateData ? `${overallRateData.overall_attendance_rate}%` : 'N/A')}
            subtitle={overallRateData ? `Total Records: ${overallRateData.total_records} (Present: ${overallRateData.present_count}, Absent: ${overallRateData.absent_count})` : ''}
            valueColor="text-emerald-600"
          />
          <AdminAttendanceStatsCard
            title="Courses with Lowest Attendance"
            items={loadingLowest ? [] : lowestCourses.map(c => ({
              name: `${c.course_code}: ${c.course_name}`,
              rate: c.attendance_rate
            }))}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AttendanceTrendLineChart departments={departments} courses={courses} loadingOptions={loadingOptions} />
          <DepartmentComparisonChart departments={departments} courses={courses} loadingOptions={loadingOptions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AttendanceDistributionChart departments={departments} courses={courses} loadingOptions={loadingOptions} />
          <TopPerformingStudentsChart departments={departments} courses={courses} loadingOptions={loadingOptions} />
        </div>

        {/* Students Table */}
        <StudentsAttendanceTable departments={departments} courses={courses} loadingOptions={loadingOptions} />
      </div>
   
  );
};

export default AttendanceForAdmin;

