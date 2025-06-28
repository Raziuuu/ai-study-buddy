import React from 'react';
import { useAuth } from '../context/AuthContext';
import Auth from './Auth';

const ProtectedRoute = ({ children, requireAuth = false }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <Auth 
          onAuthSuccess={() => {}} 
          onClose={() => {}} 
        />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute; 