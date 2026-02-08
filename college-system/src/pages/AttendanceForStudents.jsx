import React, { useState } from 'react';
import CourseSelector from '../components/student/Attendance/CourseSelector';
import AttendanceStatsCard from '../components/student/Attendance/AttendanceStatsCard';
import AttendanceLog from '../components/student/Attendance/AttendanceLog';

const AttendanceForStudents = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS421');

  // Mock data - replace with actual API calls
  const courses = [
    { id: 'CS421', code: 'CS421', name: 'Computer Design' },
    { id: 'CS301', code: 'CS301', name: 'Data Structures' },
    { id: 'CS205', code: 'CS205', name: 'Algorithms' }
  ];

  const attendanceData = [
    { date: '2025-10-15', status: 'Present' },
    { date: '2025-10-13', status: 'Present' },
    { date: '2025-10-08', status: 'Absent' },
    { date: '2025-10-06', status: 'Absent' },
  ];

  const stats = {
    attendanceRate: '95%',
    totalAbsences: '5',
    totalAttendances: '100'
  };

  return (
      <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl" >
     
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Attendance</h1>
        </div>

        {/* Course Selector */}
        <CourseSelector
          courses={courses}
          selectedCourse={selectedCourse}
          onCourseChange={setSelectedCourse}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <AttendanceStatsCard
            title="Your Attendance Rate"
            value={stats.attendanceRate}
            valueColor="text-blue-600"
          />
          <AttendanceStatsCard
            title="Total Absences"
            value={stats.totalAbsences}
            valueColor="text-red-600"
          />
          <AttendanceStatsCard
            title="Total Attendances"
            value={stats.totalAttendances}
            valueColor="text-green-600"
          />
        </div>

        {/* Attendance Log */}
        <AttendanceLog attendanceData={attendanceData} />
      </div>
   
  );
};

export default AttendanceForStudents;
