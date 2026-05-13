// importing styles and dependencies
import './App.css';
import { useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import { useAuth } from './hooks/useAuth';

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
import GroupPostsPage from './pages/GroupPostsPage';
import UserPostsPage from './pages/UserPostsPage';
import EventsPage from './pages/EventsPage';
import StudentAnalyticsPage from './pages/StudentAnalyticsPage';
import StudentMatrialsPage from './pages/StudentMatrialsPage';
import DoctorMatrialsPage from './pages/DoctorMatrialsPage';
import IDPage from './pages/IDPage';
import FAQPage from './pages/FAQPage';
import AttendanceForStudents from './pages/AttendanceForStudents';
import AttendanceForDoctors from './pages/AttendanceForDoctors';
import AttendanceForAdmin from './pages/AttendanceForAdmin';
import LowestAttendanceDetails from './pages/LowestAttendanceDetails';
import NotificationsPage from './pages/NotificationsPage';
import AcademicManagementPage from './pages/AcademicManagementPage';
import StudentsPaymentPage from './pages/StudentsPaymentPage';
import UserManagementPage from './pages/UserManagementPage';
import ManagementStudentProfile from './components/admin/User Managment/ManagementStudentProfile';
import ManagementDoctorsProfile from './components/admin/User Managment/ManagementDoctorsProfile';
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
import ExamsManagment from './pages/ExamsManagment';
import TasksPage from './pages/Tasks';
import TaskSubmissionsPage from './pages/TaskSubmissions';
import Tasks_student from './pages/Tasks_student';
import SummarizationPage from './pages/SummarizationPage';
import RecommendationCourses from './pages/RecommendationCourses';
import AdminAlertsPage from './pages/AdminAlertsPage';
import AdminActivityPage from './pages/AdminActivityPage';
import DoctorAlertsPage from './pages/DoctorAlertsPage';
import Error404Page from './pages/Erorr404Page';

const STUDENT   = ['student'];
const DOCTOR_TA = ['doctor', 'teaching_assistant'];
const ADMIN     = ['admin', 'super_admin'];
const SUPER     = ['super_admin'];
const ALL       = ['student', 'doctor', 'teaching_assistant', 'admin', 'super_admin'];

const R = (roles, element) => <RoleRoute roles={roles}>{element}</RoleRoute>;

// Smart redirect to each role's home page
function DashboardHome() {
  const { user, isLoading } = useAuth();
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }
  const homeRoutes = {
    student:            '/dashboard/info',
    doctor:             '/dashboard/doctor',
    teaching_assistant: '/dashboard/doctor',
    admin:              '/dashboard/admin',
    super_admin:        '/dashboard/admin',
  };
  return <Navigate to={homeRoutes[user.role] || '/dashboard/info'} replace />;
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="App">
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Dashboard Routes with Layout - Protected */}
            <Route path="/dashboard" element={<ProtectedRoute><MainLayoutPage /></ProtectedRoute>}>
              {/* Admin routes */}
              <Route path="admin"                              element={R(ADMIN,     <AdminDashboard />)} />
              <Route path="admin/alerts"                       element={R(ADMIN,     <AdminAlertsPage />)} />
              <Route path="admin/activity"                     element={R(ADMIN,     <AdminActivityPage />)} />
              <Route path="exams-management"                   element={R(ADMIN,     <ExamsManagment />)} />
              <Route path="academic-management"                element={R(ADMIN,     <AcademicManagementPage />)} />
              <Route path="admin-attendance"                   element={R(ADMIN,     <AttendanceForAdmin />)} />
              <Route path="user-management"                    element={R(ADMIN,     <UserManagementPage />)} />
              <Route path="user-management/students/:studentId/profile" element={R(ADMIN, <ManagementStudentProfile />)} />
              <Route path="user-management/staff/:userId/profile" element={R(ADMIN, <ManagementDoctorsProfile />)} />
              <Route path="admin-payment"                      element={R(ADMIN,     <AdminPaymentPage />)} />
              <Route path="financial-management"               element={R(ADMIN,     <FinancialManagementPage />)} />
              {/* Super-admin only */}
              <Route path="system-configuration"              element={R(SUPER,     <SystemConfigurationPage />)} />

              {/* Doctor / TA routes */}
              <Route path="doctor"                             element={R(DOCTOR_TA, <DoctorDashboard />)} />
              <Route path="doctor/alerts"                      element={R(DOCTOR_TA, <DoctorAlertsPage />)} />
              <Route path="doctor-attendance"                  element={R(DOCTOR_TA, <AttendanceForDoctors />)} />
              <Route path="doctor-attendance/lowest"           element={R(DOCTOR_TA, <LowestAttendanceDetails />)} />
              <Route path="doctor/course/:courseId"            element={R(DOCTOR_TA, <CourseDetailPage />)} />
              <Route path="doctor/course/:courseId/alerts"     element={R(DOCTOR_TA, <LowGradeAlertsPage />)} />
              <Route path="doctor/course/:courseId/grades"     element={R(DOCTOR_TA, <GradesManagementPage />)} />
              <Route path="doctor/course/:courseId/attendance" element={R(DOCTOR_TA, <LiveAttendancePage />)} />
              <Route path="teachers"                           element={R(DOCTOR_TA, <TeacherSchedulePage />)} />
              <Route path="tasks"                              element={R(DOCTOR_TA, <TasksPage />)} />
              <Route path="tasks/:taskId/submissions"          element={R(DOCTOR_TA, <TaskSubmissionsPage />)} />
              <Route path="doctormaterial"                     element={R(DOCTOR_TA, <DoctorMatrialsPage />)} />

              {/* Student routes */}
              <Route path="info"                               element={R(STUDENT,   <InfoPage />)} />
              <Route path="courses"                            element={R(STUDENT,   <CoursesGradesPage />)} />
              <Route path="exams"                              element={R(STUDENT,   <ExamSchedulePage />)} />
              <Route path="attendance"                         element={R(STUDENT,   <AttendanceForStudents />)} />
              <Route path="students"                           element={R(STUDENT,   <StudentSchedulePage />)} />
              <Route path="register"                           element={R(STUDENT,   <StudentRegistrationPage />)} />
              <Route path="student-tasks"                      element={R(STUDENT,   <Tasks_student />)} />
              <Route path="material"                           element={R(STUDENT,   <StudentMatrialsPage />)} />
              <Route path="summarization"                      element={R(STUDENT,   <SummarizationPage />)} />
              <Route path="recommendation-courses"             element={R(STUDENT,   <RecommendationCourses />)} />
              <Route path="analytics"                          element={R(STUDENT,   <StudentAnalyticsPage />)} />
              <Route path="leaderboard"                        element={R(STUDENT,   <LeaderBoardPage />)} />
              <Route path="payment"                            element={R(STUDENT,   <StudentsPaymentPage />)} />
              <Route path="id-card"                            element={R(STUDENT,   <IDPage />)} />
              <Route path="faq"                                element={R(STUDENT,   <FAQPage />)} />

              {/* Shared routes */}
              <Route path="community"                          element={R(ALL,       <CommunityPage />)} />
              <Route path="community/user/:userId/posts"       element={R(ALL,       <UserPostsPage />)} />
              <Route path="my-groups"                          element={R(ALL,       <MyGroupsPage />)} />
              <Route path="my-groups/:groupId/posts"           element={R(ALL,       <GroupPostsPage />)} />
              <Route path="events"                             element={R(ALL,       <EventsPage />)} />
              <Route path="notifications"                      element={R(ALL,       <NotificationsPage />)} />
              <Route path="settings"                           element={R(ALL,       <SettingPage />)} />

              {/* 404 catch-all inside dashboard */}
              <Route path="*" element={<Error404Page />} />

              <Route index element={<DashboardHome />} />
            </Route>

            {/* Global 404 */}
            <Route path="*" element={<Error404Page />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
