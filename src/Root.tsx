import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import LandingPage from './components/landing/LandingPage';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

const Root: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage isAdminLogin={false} />} />
      <Route path="/admin-login" element={<LoginPage isAdminLogin={true} />} />
      <Route 
        path="/app" 
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default Root;
