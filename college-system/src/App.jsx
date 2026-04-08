// importing styles and dependencies
import './App.css';
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


// Importing pages and components
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
import MyGroupsPage from './pages/MyGroupsPage';
import EventsPage from './pages/EventsPage';
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
import SettingPage from './pages/SettingPage';
import AdminPaymentPage from './pages/AdminPaymentPage';
import AdminDashboard from './pages/AdminDashboard';
import SystemConfigurationPage from './pages/SystemConfigurationPage';
import DoctorDashboard from './pages/DoctorDashboard';
import CourseDetailPage from './components/doctors/DoctorDashboard/CourseDetailPage';
import LiveAttendancePage from './components/doctors/DoctorDashboard/LiveAttendancePage';
import GradesManagementPage from './components/doctors/DoctorDashboard/GradesManagementPage';
import LowGradeAlertsPage from './components/doctors/DoctorDashboard/LowGradeAlertsPage';
import FinancialManagementPage from './pages/FinancialManagementPage';
import StudentAttendanceDetails from './pages/StudentAttendanceDetails';
import ExamsManagment from './pages/ExamsManagment';
import TasksPage from './pages/Tasks';
import TaskSubmissionsPage from './pages/TaskSubmissions';
import Tasks_student from './pages/Tasks_student';
import AdminAlertsPage from './pages/AdminAlertsPage';
import AdminActivityPage from './pages/AdminActivityPage';
import DoctorAlertsPage from './pages/DoctorAlertsPage';

function App() {
  return (
    <div className="App">
      <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Dashboard Routes with Layout - Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><MainLayoutPage /></ProtectedRoute>}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/alerts" element={<AdminAlertsPage />} />
          <Route path="admin/activity" element={<AdminActivityPage />} />
          <Route path="info" element={<InfoPage />} />
          <Route path="courses" element={<CoursesGradesPage />} />
          <Route path="exams" element={<ExamSchedulePage />} />
          <Route path="attendance" element={<AttendanceForStudents />} />
          <Route path="teachers" element={<TeacherSchedulePage />} />
          <Route path="students" element={<StudentSchedulePage />} />
          <Route path="register" element={<StudentRegistrationPage />} />
          {/* Tasks Route - Updated to use the robust TasksPage replacing placeholder */}
          <Route path="tasks" element={<TasksPage />} />
          <Route path="tasks/:taskId/submissions" element={<TaskSubmissionsPage />} />
          <Route path="student-tasks" element={<Tasks_student />} />
          <Route path="material" element={<StudentMatrialsPage />} />
          <Route path="doctormaterial" element={<DoctorMatrialsPage />} />
          <Route path="analytics" element={<StudentAnalyticsPage />} />
          <Route path="leaderboard" element={<LeaderBoardPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="my-groups" element={<MyGroupsPage />} />
          <Route path="events" element={<EventsPage />} />
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
          <Route path="settings" element={<SettingPage />} />
          <Route path="financial-management" element={<FinancialManagementPage />} />
          <Route path="student-attendance-details" element={<StudentAttendanceDetails />} />
          <Route path="exams-management" element={<ExamsManagment />} />
          {/* Doctor Routes */}
          <Route path="doctor" element={<DoctorDashboard />} />
          <Route path="doctor/alerts" element={<DoctorAlertsPage />} />
          <Route path="doctor-attendance" element={<AttendanceForDoctors />} />
          <Route path="doctor/course/:courseId" element={<CourseDetailPage />} />
          <Route path="doctor/course/:courseId/alerts" element={<LowGradeAlertsPage />} />
          <Route path="doctor/course/:courseId/grades" element={<GradesManagementPage />} />
          <Route path="doctor/course/:courseId/attendance" element={<LiveAttendancePage />} />
          
          <Route index element={<InfoPage />} />
        </Route>
      </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
