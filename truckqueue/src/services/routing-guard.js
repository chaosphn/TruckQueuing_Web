// components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated1 = localStorage.getItem('authToken') !== null; 
  const isAuthenticated2 = sessionStorage.getItem('authToken') !== null; 

  if (!isAuthenticated1 && !isAuthenticated2) {
    console.warn('Unauthorized access attempt detected. Redirecting to home page.');
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />; 
};

export default PrivateRoute;