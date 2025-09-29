import React, { useState, useEffect, useContext } from 'react';
import { Monitor, List, User, Bell, Settings } from 'lucide-react';
import backgroundImg from '../../assets/background.png';
import logoImg from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import TruckModel from '../../components/truck/truck-model';
import { QueueContext } from '../../utils/AppContext';

const LandingPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeNotifications, setActiveNotifications] = useState(3);
  const [dailyFinish, setDailyFinish] = useState(0);
  const [dailyQueue, setDailyQueue] = useState(0);
  const [dailyLoading, setDailyLoading] = useState(0);
  const [dailyWaiting, setDailyWaiting] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const { queue, updateQueueData, bayData, waitingQueue, updateBayData, registerQueue, updateRegisterQueueData, apiStatus, updateApiStatus, tasStatus, updateTASStatus } = useContext(QueueContext);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleNavigatePage = (page) => {
    navigate(`/${page}`);
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('th-TH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  function getTomorrowMidnight() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1); 
    tomorrow.setHours(0, 0, 0, 0); 
    return tomorrow.getTime();
  }

  const menuItems = [
    {
      id: 'register',
      title: 'TAS Register',
      subtitle: 'ลงทะเบียนรถบรรทุก',
      page: '',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    {
      id: 'monitoring',
      title: 'TAS Monitoring',
      subtitle: 'ติดตามสถานะการโหลด',
      page: 'dashboard',
      icon: Monitor,
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700'
    },
    {
      id: 'queue',
      title: 'Queue Management',
      subtitle: 'จัดการคิวรถบรรทุก',
      page: 'management',
      icon: List,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700'
    }
  ];

  return (
    <div className="h-full min-h-screen relative overflow-hidden flex flex-col justify-between ">
      <div 
        className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <img alt='bg' src={backgroundImg} className='w-full h-auto' />
      </div>
      
      <header className="relative z-10 bg-black/30 backdrop-blur-sm border-b border-white/20">
        <div className="mx-auto px-16 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3" onClick={toggleFullscreen}>
                {/* <div className="w-20 h-20 flex items-center justify-center shadow-lg">
                  <img src={logoImg} width={150} height={100} />
                </div> */}
                <img alt='logo' src={logoImg} width={100} height={100} className=''/>
                <div>
                  <h1 className="text-2xl font-bold text-white drop-shadow-lg">PTTLNG Truck Queuing System</h1>
                  <p className="text-blue-100 text-xl drop-shadow mt-1">ระบบบริหารจัดการคิวรถ</p>
                </div>
              </div>
            </div>

            {/* <div className='h-auto scale-150'>
            <TruckModel></TruckModel>
            </div> */}
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-white font-mono text-3xl font-bold drop-shadow-lg">
                  {formatTime(currentTime)}
                </div>
                <div className="text-blue-100 text-xl drop-shadow mt-1">
                  {formatDate(currentTime)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16 py-6 rounded-lg bg-black/10 backdrop-blur-sm border-t border-white/20 shadow-2xl">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-2xl">
            TRUCK QUEUING SYSTEM
          </h2>
          {/* <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
            ระบบจัดการการโหลดรถบรรทุก
          </p> */}
        </div>

        {/* Menu Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {menuItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleNavigatePage(item.page)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
              
              <button className={`relative w-full bg-gradient-to-r ${item.color} hover:bg-gradient-to-r hover:${item.hoverColor} rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-white/10`}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-white/80 text-xl">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 group-hover:translate-x-full transition-transform duration-700"></div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Status Bar */}
        <div className="mt-20 bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-green-400 drop-shadow-lg" style={{ textShadow: '0 2px 5px rgba(0, 0, 0, 0.8)' }}>{queue?.WaitQueue??'---'}</div>
              <div className="text-white/80 text-2xl mt-4 drop-shadow">รถในคิว</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-400 drop-shadow-lg" style={{ textShadow: '0 2px 5px rgba(0, 0, 0, 0.8)' }}>{queue?.Loadding??'---'}</div>
              <div className="text-white/80 text-2xl mt-4 drop-shadow">กำลังโหลด</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400 drop-shadow-lg" style={{ textShadow: '0 2px 5px rgba(0, 0, 0, 0.8)' }}>{queue?.OrderToday??'---'}</div>
              <div className="text-white/80 text-2xl mt-4 drop-shadow">ออเดอร์วันนี้</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-400 drop-shadow-lg" style={{ textShadow: '0 2px 5px rgba(0, 0, 0, 0.8)' }}>{queue?.FinishQueue??'---'}</div>
              <div className="text-white/80 text-2xl mt-4 drop-shadow">เสร็จสิ้นวันนี้</div>
            </div>
          </div>
        </div>

      </main>

      <footer className="relative bg-black/20 backdrop-blur-sm border-t border-white/20">
        <div className="mx-auto px-16 py-6">
          <div className="flex items-center justify-between">
            <div className="text-white/80 text-base drop-shadow">
              © 2025 PTTLNG Truck Queuing System
            </div>
            <div className="flex items-center space-x-4 text-white/80 text-base drop-shadow">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span className='font-semibold'>Mode : { tasStatus && tasStatus.OfflineMode == false ? 'Online' : tasStatus && tasStatus.OfflineMode == true ? 'Offline' : 'Unknow' }</span>
              <span>•</span>
              <span className='font-semibold'>{ apiStatus && apiStatus.SystemOnline === true ? 'System Online' : 'System Offline' }</span>
              <div className={`w-4 h-4 ${ apiStatus && apiStatus.SystemOnline === true ? 'bg-green-400' : 'bg-red-500' } rounded-full`}></div>
              <span>•</span>
              <span className='font-semibold'>{ apiStatus && apiStatus.NetworkOnline === true ? 'Network Online' : 'Network Offline' }</span>
              <div className={`w-4 h-4 ${ apiStatus && apiStatus.NetworkOnline === true ? 'bg-green-400' : 'bg-red-500' } rounded-full`}></div>
              { apiStatus && apiStatus.DBOnline !== true && (
                <span>: Cannot connect to TAS Server database</span>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;