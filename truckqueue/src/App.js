// App.js
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './services/routing-guard'; 
import LandingPage from './pages/landing/page';
import CarrierDashboard from './pages/dashboard/page';
import CarrierManagement from './pages/management/page';
import RegisterPage from './pages/register/page';
import LoginPage from './pages/login/page';
import { BayContext, QueueContext } from './utils/AppContext';
import config from "../src/assets/config.json";
import { loadConfig } from './services/http-service';

function App() {

  const { queue, updateQueueData, bayData, waitingQueue, updateBayData, registerQueue, updateRegisterQueueData } = useContext(QueueContext);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    updateQueueData();
    updateBayData();
    updateRegisterQueueData();
    handleGetConfig();
    //console.log(bayData)
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      updateBayData();
    }, config?.INTERVAL??5000);
    return () => clearInterval(timer);
  }, [config]);

  useEffect(() => {
    const timer1 = setInterval(() => {
      updateQueueData();
      updateRegisterQueueData();
    }, 300000);
    return () => clearInterval(timer1);
  }, [config]);

  const handleGetConfig = async () => {
    const res = await loadConfig();
    if(res){
      setConfig(res);
    }
  };

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