// components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken') !== null; 

  if (!isAuthenticated) {
    console.warn('Unauthorized access attempt detected. Redirecting to home page.');
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />; 
};

export default PrivateRoute;