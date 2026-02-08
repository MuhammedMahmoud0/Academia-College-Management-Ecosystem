import React, { useState } from 'react';
import DoctorCourseSelector from '../components/doctors/Attendance/DoctorCourseSelector';
import DoctorAttendanceStatsCard from '../components/doctors/Attendance/DoctorAttendanceStatsCard';
import AttendanceTrendChart from '../components/doctors/Attendance/AttendanceTrendChart';
import AttendanceGrid from '../components/doctors/Attendance/AttendanceGrid';

const AttendanceForDoctors = () => {
  const [selectedCourse, setSelectedCourse] = useState('CS421');

  // Mock data - replace with actual API calls
  const courses = [
    { id: 'CS421', code: 'CS421', name: 'Computer Design' },
    { id: 'CS301', code: 'CS301', name: 'Data Structures' },
    { id: 'CS205', code: 'CS205', name: 'Algorithms' }
  ];

  const [attendanceData, setAttendanceData] = useState({
    dates: ['2025-10-15', '2025-10-13'],
    students: [
      {
        id: 1,
        name: 'Student A',
        attendance: {
          '2025-10-15': 'Present',
          '2025-10-13': 'Absent'
        }
      },
      {
        id: 2,
        name: 'Student B',
        attendance: {
          '2025-10-15': 'Present',
          '2025-10-13': 'Present'
        }
      }
    ]
  });

  const stats = {
    avgAttendanceRate: '92%',
    lowestAttendance: [
      { name: 'Michael B.', rate: 75 },
      { name: 'Jessica W.', rate: 78 }
    ]
  };

  const trendData = [
    { week: 'Week 1', rate: 88 },
    { week: 'Week 2', rate: 91 },
    { week: 'Week 3', rate: 89 },
    { week: 'Week 4', rate: 92 }
  ];

  const handleUpdateAttendance = (studentId, date, newStatus) => {
    setAttendanceData((prevData) => ({
      ...prevData,
      students: prevData.students.map((student) => {
        if (student.id === studentId) {
          return {
            ...student,
            attendance: {
              ...student.attendance,
              [date]: newStatus
            }
          };
        }
        return student;
      })
    }));
  };

  return (
    <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl" >
   
        {/* Header */}
        <div className="mb-6">
       <h1 className="text-3xl font-bold text-slate-900 mb-2">Attendance</h1>
        </div>

        {/* Course Selector */}
        <DoctorCourseSelector
          courses={courses}
          selectedCourse={selectedCourse}
          onCourseChange={setSelectedCourse}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <DoctorAttendanceStatsCard
            title="Avg. Attendance Rate"
            value={stats.avgAttendanceRate}
            valueColor="text-emerald-600"
          />
          <DoctorAttendanceStatsCard
            title="Lowest Attendance"
            students={stats.lowestAttendance}
          />
          <AttendanceTrendChart data={trendData} />
        </div>

        {/* Attendance Grid */}
        <AttendanceGrid
          attendanceData={attendanceData}
          onUpdateAttendance={handleUpdateAttendance}
        />
      </div>
 
  );
};

export default AttendanceForDoctors;
