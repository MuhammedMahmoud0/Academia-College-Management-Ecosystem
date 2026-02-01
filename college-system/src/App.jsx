import './App.css';
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import MainLayoutPage from './pages/MainLayoutPage';
import InfoPage from './pages/InfoPage';
import CoursesGradesPage from './pages/CoursesGradesPage';
import ExamSchedulePage from './pages/ExamSchedulePage';
import TeacherSchedulePage from './pages/TeacherSchedulePage';
import StudentSchedulePage from './pages/StudentSchedulePage';
import StudentRegistrationPage from './pages/StudentRegistrationPage';
import LeaderBoardPage from './pages/LeaderBoardPage';
import CommunityPage from './pages/CommunityPage';
import StudentAnalyticsPage from './pages/StudentAnalyticsPage';
import StudentMatrialsPage from './pages/StudentMatrialsPage';
import DoctorMatrialsPage from './pages/DoctorMatrialsPage';
import IDPage from './pages/IDPage';
import FAQPage from './pages/FAQPage';
import AttendanceForStudents from './pages/AttendanceForStudents';
import AttendanceForDoctors from './pages/AttendanceForDoctors';
import AttendanceForAdmin from './pages/AttendanceForAdmin';
import NotificationsPage from './pages/NotificationsPage';
import AcademicManagementPage from './pages/AcademicManagementPage';
import StudentsPaymentPage from './pages/StudentsPaymentPage';
import UserManagementPage from './pages/UserManagementPage';
import ManagementProfile from './components/admin/User Managment/ManagementProfile';
import AdminPaymentPage from './pages/AdminPaymentPage';
import AdminDashboard from './pages/AdminDashboard';
import SystemConfigurationPage from './pages/SystemConfigurationPage';
import DoctorDashboard from './pages/DoctorDashboard';
import CourseDetailPage from './components/doctors/DoctorDashboard/CourseDetailPage';
import LiveAttendancePage from './components/doctors/DoctorDashboard/LiveAttendancePage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Dashboard Routes with Layout */}
        <Route path="/dashboard" element={<MainLayoutPage />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="info" element={<InfoPage />} />
          <Route path="courses" element={<CoursesGradesPage />} />
          <Route path="exams" element={<ExamSchedulePage />} />
          <Route path="attendance" element={<AttendanceForStudents />} />
          <Route path="teachers" element={<TeacherSchedulePage />} />
          <Route path="students" element={<StudentSchedulePage />} />
          <Route path="register" element={<StudentRegistrationPage />} />
          <Route path="tasks" element={<div className="text-2xl">Daily Tasks Page</div>} />
          <Route path="material" element={<StudentMatrialsPage />} />
          <Route path="doctormaterial" element={<DoctorMatrialsPage />} />
          <Route path="analytics" element={<StudentAnalyticsPage />} />
          <Route path="leaderboard" element={<LeaderBoardPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="payment" element={<StudentsPaymentPage />} />
          <Route path="id-card" element={<IDPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="academic-management" element={<AcademicManagementPage />} />
          <Route path="admin-attendance" element={<AttendanceForAdmin />} />
          <Route path="user-management" element={<UserManagementPage />} />
          <Route path="user-management/management-profile" element={<ManagementProfile />} />
          <Route path="admin-payment" element={<AdminPaymentPage />} />
          <Route path="system-configuration" element={<SystemConfigurationPage />} />
          
          {/* Doctor Routes */}
          <Route path="doctor" element={<DoctorDashboard />} />
          <Route path="doctor-attendance" element={<AttendanceForDoctors />} />
          <Route path="doctor/course/:courseId" element={<CourseDetailPage />} />
          <Route path="doctor/course/:courseId/attendance" element={<LiveAttendancePage />} />
          
          <Route index element={<InfoPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
