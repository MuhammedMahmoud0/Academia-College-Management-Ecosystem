import './App.css';
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
    </div>
  );
}

export default App;
