// App.js
import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './services/routing-guard'; 
import LandingPage from './pages/landing/page';
import CarrierDashboard from './pages/dashboard/page';
import CarrierManagement from './pages/management/page';
import RegisterPage from './pages/register/page';
import LoginPage from './pages/login/page';
import { BayContext, QueueContext } from './utils/AppContext';

function App() {

  const { queue, updateQueueData, bayData, waitingQueue, updateBayData } = useContext(QueueContext);

  useEffect(() => {
    updateQueueData();
    updateBayData();
    console.log(bayData)
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      updateBayData();
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/overview" element={<LandingPage />} />
        <Route path="/dashboard" element={<CarrierDashboard />} />
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Protected Route */}
        <Route 
          path="/management" 
          element={
            <PrivateRoute>
              <CarrierManagement />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;