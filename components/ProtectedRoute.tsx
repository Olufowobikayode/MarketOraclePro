
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import { useSelector } from 'react-redux';
import { RootState } from '../types';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const apiKey = useSelector((state: RootState) => state.auth.apiKey);
  const location = useLocation();
  
  if (loading) {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-stone-950">
            <LoadingSpinner message="Verifying credentials..." />
        </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ENFORCED: If user has no API Key, redirect to setup page.
  // Prevent infinite redirect loop if we are already on the setup page.
  if (!apiKey && location.pathname !== '/api-setup') {
      return <Navigate to="/api-setup" replace />;
  }

  return children;
};

export default ProtectedRoute;
