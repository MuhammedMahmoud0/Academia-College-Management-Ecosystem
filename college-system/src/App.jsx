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
          <Route path="material" element={<div className="text-2xl">Material Page</div>} />
          <Route path="analytics" element={<div className="text-2xl">Analytics Page</div>} />
          <Route path="leaderboard" element={<div className="text-2xl">Leaderboard Page</div>} />
          <Route path="community" element={<div className="text-2xl">Community Page</div>} />
          <Route path="payment" element={<div className="text-2xl">Payment Page</div>} />
          <Route index element={<Info />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
