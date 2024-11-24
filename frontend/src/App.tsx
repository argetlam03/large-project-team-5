import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import TypePage from './pages/TypePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
function App() {
  var _ud = localStorage.getItem('user_data');
  
  return (
    <Router >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/type" element={_ud ? <TypePage />:<Navigate to="/"/>} />
        <Route path="/leaderboard" element={_ud ? <LeaderboardPage />:<Navigate to="/"/>} />
        <Route path="/profile" element={_ud ? <ProfilePage />:<Navigate to="/"/>} />
      </Routes>
    </Router>
  );
}
export default App;