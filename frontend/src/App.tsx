import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import TypePage from './pages/TypePage';
function App() {
  var _ud = localStorage.getItem('user_data');
  
  return (
    <Router >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/type" element={_ud ? <TypePage />:<Navigate to="/"/>} />
      </Routes>
    </Router>
  );
}
export default App;