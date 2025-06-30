import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import DocumentList from './pages/DocumentList';
import DocumentDetail from './pages/DocumentDetail';
import DocumentCreate from './pages/DocumentCreate';
import Navbar from './components/Navbar';
import { getToken } from './utils/auth';
import './index.css';

  import { ToastContainer, toast } from 'react-toastify';


const PrivateRoute = ({ children }) => {
  const isAuthenticated = getToken();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!getToken());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      {isLoggedIn && <Navbar />}
        <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto p-1 rounded bg-blue">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/documents" element={<PrivateRoute><DocumentList /></PrivateRoute>} />
          <Route path="/documents/new" element={<PrivateRoute><DocumentCreate /></PrivateRoute>} />
          <Route path="/documents/:id" element={<PrivateRoute><DocumentDetail /></PrivateRoute>} />
          {/* Add a route for notifications */}
          {/* <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
