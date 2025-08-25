// components/PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { loadConfig } from './http-service';

const PrivateRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token1 = localStorage.getItem('authToken');
      const token2 = sessionStorage.getItem('authToken');
      const token = token1 || token2;

      if (!token) {
        setIsAuth(false);
        return;
      }

      try {
        const cfg = await loadConfig();
        const authAlive = cfg.AUTH_ALIVE || 7; // ค่า default 7 วัน

        // แยก timestamp จาก token
        const parts = token.split('_');
        if (parts.length < 2) {
          setIsAuth(false);
          return;
        }

        const tokenDate = new Date(parts[1]);
        const now = new Date();
        const diffDays = (now - tokenDate) / (1000 * 60 * 60 * 24); // คำนวณวัน

        if (diffDays > authAlive) {
          // token หมดอายุ
          setIsAuth(false);
          return;
        }

        setIsAuth(true);
      } catch (error) {
        console.error(error);
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) {
    return null; // หรือ loading indicator
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;
