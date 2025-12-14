import './App.css';
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import MainLayoutPage from './pages/MainLayoutPage';
import Info from './components/info page/Info';
import CoursesAndGradesPage from './components/courses&grades/courses&grades';
import ExamSchedulePage from './components/examSchedule/ExamSchedule';
import TeacherSchedulePage from './components/TeacherSchedule/TeacherSchedule';
import StudentSchedulePage from './components/StudentSchedule/StudentSchedule';
import StudentRegistrationPage from './components/StuentRegestration/StudentRegestration';
import LeaderBoardPage from './components/Leaderboard/LeaderBoard';
import CommunityPage from './components/Community Page/CommunityPage';
import StudentAnalyticsPage from './components/Student Analytics/StudentAnalytics';
import StudentMatrialsPage from './components/Student Matrials/StudentMatrials';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Dashboard Routes with Layout */}
        <Route path="/dashboard" element={<MainLayoutPage />}>
          <Route path="info" element={<Info />} />
          <Route path="courses" element={<CoursesAndGradesPage />} />
          <Route path="exams" element={<ExamSchedulePage />} />
          <Route path="teachers" element={<TeacherSchedulePage />} />
           <Route path="students" element={<StudentSchedulePage />} />
          <Route path="register" element={<StudentRegistrationPage />} />
          <Route path="tasks" element={<div className="text-2xl">Daily Tasks Page</div>} />
          <Route path="material" element={<StudentMatrialsPage />} />
          <Route path="analytics" element={<StudentAnalyticsPage />} />
          <Route path="leaderboard" element={<LeaderBoardPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="payment" element={<div className="text-2xl">Payment Page</div>} />
          <Route index element={<Info />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
