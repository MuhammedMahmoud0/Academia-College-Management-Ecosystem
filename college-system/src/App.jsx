import './App.css';
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import MainLayoutPage from './pages/MainLayoutPage';
import Info from './components/info page/Info';


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
          <Route path="courses" element={<div className="text-2xl">Courses & Grades Page</div>} />
          <Route path="exams" element={<div className="text-2xl">Exams Page</div>} />
          <Route path="teachers" element={<div className="text-2xl">Teacher's Table Page</div>} />
          <Route path="register" element={<div className="text-2xl">Courses Register Page</div>} />
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
