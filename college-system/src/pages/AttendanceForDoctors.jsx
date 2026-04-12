import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorCourseSelector from '../components/doctors/Attendance/DoctorCourseSelector';
import DoctorAttendanceStatsCard from '../components/doctors/Attendance/DoctorAttendanceStatsCard';
import AttendanceTrendChart from '../components/doctors/Attendance/AttendanceTrendChart';
import AttendanceGrid from '../components/doctors/Attendance/AttendanceGrid';
import { getTeacherSchedule } from '../services/scheduleService';
import { getAverageAttendance, getLowestAttendance, getAttendanceTrend, getAttendanceGrid, updateAttendanceRecord } from '../services/doctorAttendance';

const AttendanceForDoctors = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  
  const [stats, setStats] = useState({
    avgAttendanceRate: '...',
    lowestAttendance: []
  });
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Teacher Schedule to populate assignments
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const scheduleResponse = await getTeacherSchedule();
        const sched = scheduleResponse.schedule || [];
        const uniqueAssignments = [];
        const seenIds = new Set();
        
        sched.forEach(day => {
          day.slots?.forEach(slot => {
            const isLab = slot.type && slot.type.toLowerCase() === 'tutorial/lab';
            const sessionId = isLab ? `tut_${slot.tutorialLabId}` : `lec_${slot.lectureId}`;
            
            if (!seenIds.has(sessionId)) {
              seenIds.add(sessionId);
              uniqueAssignments.push({
                id: sessionId,
                code: slot.courseCode,
                name: `${slot.courseName} - ${isLab ? 'LAB' : 'LECTURE'} (${day.day} ${slot.startTime})`,
                lecture_id: !isLab ? slot.lectureId : undefined,
                tutorial_lab_id: isLab ? slot.tutorialLabId : undefined
              });
            }
          });
        });
        
        setCourses(uniqueAssignments);
        if (uniqueAssignments.length > 0) {
          setSelectedCourse(uniqueAssignments[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch teacher schedule:", error);
      }
    };
    fetchCourses();
  }, []);

  // Fetch stats when a session is selected
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        const selectedObj = courses.find(c => c.id === selectedCourse);
        if (!selectedObj) {
          setLoading(false);
          return;
        }

        const params = {};
        if (selectedObj.lecture_id) params.lecture_id = selectedObj.lecture_id;
        if (selectedObj.tutorial_lab_id) params.tutorial_lab_id = selectedObj.tutorial_lab_id;

        const [avgRes, lowestRes, trendRes, gridRes] = await Promise.all([
          getAverageAttendance(params),
          getLowestAttendance({ ...params, limit: 3 }),
          getAttendanceTrend(params),
          getAttendanceGrid(params)
        ]);

        const avgRate = avgRes.avg_attendance_rate != null 
          ? `${avgRes.avg_attendance_rate}%` 
          : 'N/A';

        const lowestFormatted = (lowestRes.students || []).map(s => ({
          name: s.full_name,
          rate: s.attendance_percentage
        }));

        const trendFormatted = (trendRes.weeks || []).map(w => ({
          week: `Week ${w.week}`,
          rate: w.attendance_rate
        }));

        setStats({
          avgAttendanceRate: avgRate,
          lowestAttendance: lowestFormatted
        });
        setTrendData(trendFormatted);
        
        if (gridRes) {
          // gridRes has { dates: [...], students: [...] } directly
          setAttendanceData({
            dates: gridRes.dates || [],
            students: gridRes.students || []
          });
        }
      } catch (error) {
        console.error("Failed to fetch attendance stats/grid:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedCourse, courses]);

  const [attendanceData, setAttendanceData] = useState({
    dates: [],
    students: []
  });

  const handleUpdateAttendance = async (studentId, date, newStatus) => {
    const selectedObj = courses.find(c => c.id === selectedCourse);
    if (!selectedObj) return;

    try {
      // Endpoint expects lowercased status e.g., 'present', 'absent'
      const statusValue = newStatus.toLowerCase();
      
      const payload = {
        student_user_id: studentId,
        session_date: date,
        status: statusValue
      };
      
      if (selectedObj.lecture_id) payload.lecture_id = selectedObj.lecture_id;
      if (selectedObj.tutorial_lab_id) payload.tutorial_lab_id = selectedObj.tutorial_lab_id;

      await updateAttendanceRecord(payload);

      // Successfully updated backend, reflect on frontend
      setAttendanceData((prevData) => ({
        ...prevData,
        students: prevData.students.map((student) => {
          if (student.student_user_id === studentId) {
            return {
              ...student,
              attendance: {
                ...student.attendance,
                [date]: {
                  ...(student.attendance[date] || {}),
                  status: statusValue
                }
              }
            };
          }
          return student;
        })
      }));
    } catch (error) {
      console.error("Failed to update attendance record:", error);
      alert("Failed to update attendance record. Please try again.");
    }
  };

  const handleLowestAttendanceArrowClick = () => {
    const selectedObj = courses.find(c => c.id === selectedCourse);
    if (!selectedObj) return;

    navigate('/dashboard/doctor-attendance/lowest', {
      state: {
        lecture_id: selectedObj.lecture_id,
        tutorial_lab_id: selectedObj.tutorial_lab_id,
        courseName: selectedObj.name,
        courseCode: selectedObj.code
      }
    });
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

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500 font-medium">Loading attendance data...</div>
          </div>
        ) : attendanceData.dates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center mt-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Attendance Records</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              There are no attendance records for this session yet. Records will appear here once sessions are conducted.
            </p>
          </div>
        ) : (
          <>
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
                onArrowClick={handleLowestAttendanceArrowClick}
              />
              <AttendanceTrendChart data={trendData} />
            </div>

            {/* Attendance Grid */}
            <AttendanceGrid
              attendanceData={attendanceData}
              onUpdateAttendance={handleUpdateAttendance}
            />
          </>
        )}
      </div>
  );
};

export default AttendanceForDoctors;
