import React, { useState, useEffect } from 'react';
import { Monitor, List, User, Bell, Settings } from 'lucide-react';
import backgroundImg from '../../assets/background.png';
import logoImg from '../../assets/logo.png';
import { useRouting } from '../../hooks/routing-hook';
import TruckQueueDialog from '../../components/queue-dialog/dialog';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TruckDataDialog from '../../components/data-dialog/dialog';
import { set } from 'date-fns';
import PlateDialog from '../../components/plate-dialog/dialog';
import OrderDialog from '../../components/order-dialog/dialog';

const RegisterPage = () => {
  const [pageState, setPageState] = useState('truck');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeNotifications, setActiveNotifications] = useState(3);
  const { navigatePage } = useRouting();
  const [ openQueueDialog, setOpenQueueDialog ] = useState(false);
  const [ openDryRunDialog, setOpenDryRunDialog ] = useState(false);
  const [ openDataDialog, setOpenDataDialog ] = useState(false);
  const [ queueData, setQueueData ] = useState([]);
  const [ queueDataMode, setQueueDataMode ] = useState('');
  const [ queueDataType, setQueueDataType ] = useState('');
  const [ seletedTruck, setSelectedTruck ] = useState('');
  const [ dialogTitle, setDialogTitle ] = useState('');
  const [ dialogTopic, setDialogTopic ] = useState('');
  const [ dialogIsHead, setDialogIsHead ] = useState(false);
  const [ dryrunMode, setDryrunMode ] = useState(false);
 
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const menuItems = [
    {
      id: '1',
      title: 'จองคิวเข้าโหลด',
      subtitle: 'ลงทะเบียนรถบรรทุก',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    {
      id: '2',
      title: 'DRY RUN',
      subtitle: 'ติดตามสถานะการโหลด',
      icon: Monitor,
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700'
    }
  ];

  const truckItems = [
    {
      id: '1',
      title: '10 Wheel',
      value: '10-Wheel',
      subtitle: 'ลงทะเบียนรถบรรทุก',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    {
      id: '2',
      title: 'Semi Trailer',
      value: 'Semi-Trailer',
      subtitle: 'ติดตามสถานะการโหลด',
      icon: Monitor,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700'
    },
    {
      id: '3',
      title: 'ISO Tank',
      value: 'ISO-Tank',
      subtitle: 'ติดตามสถานะการโหลด',
      icon: Monitor,
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700'
    }
  ];

  const typeItems = [
    {
      id: '1',
      title: 'ค้นหาเลขทะเบียน',
      subtitle: '',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    {
      id: '2',
      title: 'ค้นหาเลขออเดอร์',
      subtitle: '',
      icon: Monitor,
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700'
    }
  ];

  const typeDryrunItems = [
    {
      id: '1',
      title: 'Dry Run',
      subtitle: 'เฉพาะหัวลาก',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    {
      id: '2',
      title: 'Dry Run',
      subtitle: 'หัวและหางลาก',
      icon: Monitor,
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700'
    }
  ];

  const handleOpenDialog = (id) => {
    if(id === '1'){
      setPageState('plate');
      setDialogTitle('ลงทะเบียนจองคิวเข้าโหลดสินค้า');
      setDialogTopic('ค้นหาเลขทะเบียน');
      setDryrunMode(false);
      setDialogIsHead(false);
      setOpenQueueDialog(true);
      setOpenDryRunDialog(false);
      setOpenDataDialog(false);
    } else {
      setPageState('order');
      setDialogTitle('ลงทะเบียนจองคิวเข้าโหลดสินค้า');
      setDialogTopic('ค้นหาเลขทะเบียน');
      setDryrunMode(false);
      setDialogIsHead(false);
      setOpenQueueDialog(false);
      setOpenDryRunDialog(true);
      setOpenDataDialog(false);
    }
  }

  const handleOpenDryRunDialog = (id) => {
    setPageState('dialog');
    if(id === '1'){
      setDialogTitle('');
      setDialogTopic('ใส่หมายเลขทะเบียน');
      setDialogIsHead(true);
      setDryrunMode(true);
      setOpenQueueDialog(true);
      setOpenDryRunDialog(false);
      setOpenDataDialog(false);
    } else {
      setDialogTitle('');
      setDialogTopic('ใส่หมายเลขทะเบียน');
      setDialogIsHead(false);
      setDryrunMode(true);
      setOpenQueueDialog(true);
      setOpenDryRunDialog(false);
      setOpenDataDialog(false);
    }
  }

  const handleSaveDialog = (item) => {
    //console.log(item.length);
    //console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZ');
    if(item.data && item.data.length > 0){
      setQueueData(item.data);
      setQueueDataMode(item.mode);
      setQueueDataType(item.type);
      setOpenDataDialog(true);
    }
    setOpenQueueDialog(false);
    setOpenDryRunDialog(false);
  };

  const handleCloseQueueDialog = () => {
    //console.log('XXXXXXXXXXXXXXXXXXXXXXXX');
    setPageState('truck');
    setDialogTitle('');
    setQueueData([]);
    setQueueDataMode('');
    setQueueDataType('');
    setOpenQueueDialog(false);
    setOpenDryRunDialog(false);
    setOpenDataDialog(false);
  };

  const handleSelectTruck = (truck) => {
    setSelectedTruck(truck);
    setPageState('mode');
  };

  const handleSelectMode = (mode) => {
    if(mode === '1'){
      setPageState('queue');
    } else {
      setPageState('dryrun');
      // setDialogTitle('ลงทะเบียนจองคิว Dry Run');
      // setOpenQueueDialog(false);
      // setOpenDryRunDialog(true);
      // setOpenDataDialog(false);
    }
  }

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
              <div className="flex items-center space-x-3" onClick={() => navigatePage('/overview')}>
                {/* <div className="w-20 h-20 flex items-center justify-center shadow-lg">
                  <img src={logoImg} width={150} height={100} />
                </div> */}
                <img alt='logo' src={logoImg} width={100} height={100} className=''/>
                <div>
                  <h1 className="text-2xl font-bold text-white drop-shadow-lg">PTT LNG</h1>
                  <p className="text-blue-100 text-xl drop-shadow mt-1">ระบบบริหารจัดการคิวรถบรรทุก</p>
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

      {
        pageState == 'truck' ?
        <main className="relative z-10 mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16 py-12 px-32 rounded-lg bg-black/10 backdrop-blur-sm border border-white/20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight drop-shadow-2xl">
              กรุณาเลือกประเภทของรถบรรทุก
            </h2>
            {/* <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
              ระบบจัดการการโหลดรถบรรทุก
            </p> */}
          </div>

          {/* Menu Cards */}
          <div className="flex flex-wrap items-center justify-center gap-8 max-w-screen-xl mx-auto">
            {truckItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative w-[400px]"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => {handleSelectTruck(item.value)}}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>         
                <button className={`relative w-full bg-gradient-to-r ${item.color} hover:bg-gradient-to-r hover:${item.hoverColor} rounded-2xl p-16 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-white/10`}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <item.icon className="w-8 h-8 text-white" />
                    </div> */}
                    
                    <div>
                      <h3 className="text-5xl font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      {/* <p className="text-white/80 text-sm">
                        {item.subtitle}
                      </p> */}
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
        </main> 
        : pageState == 'mode' ?
        <main className="relative z-10 max-w-screen-xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16 py-12 px-32 rounded-lg bg-black/10 backdrop-blur-sm border border-white/20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight drop-shadow-2xl">
              TRUCK LOADING SYSTEM
            </h2>
            {/* <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
              ระบบจัดการการโหลดรถบรรทุก
            </p> */}
          </div>

          {/* Menu Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-screen-xl mx-auto">
            {menuItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative w-full"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => {handleSelectMode(item.id)}}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>         
                <button className={`relative w-full bg-gradient-to-r ${item.color} hover:bg-gradient-to-r hover:${item.hoverColor} rounded-2xl p-16 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-white/10`}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <item.icon className="w-8 h-8 text-white" />
                    </div> */}
                    
                    <div>
                      <h3 className="text-5xl font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      {/* <p className="text-white/80 text-sm">
                        {item.subtitle}
                      </p> */}
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
        </main> 
        : pageState == 'queue' ?
        <main className="relative z-10 max-w-screen-xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16 py-12 px-32 rounded-lg bg-black/10 backdrop-blur-sm border border-white/20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-14 tracking-tight drop-shadow-2xl">
              TRUCK LOADING SYSTEM
            </h2>
            <p className="text-5xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
              ลงทะเบียนจองคิวเข้าโหลดสินค้า
            </p>
          </div>

          {/* Menu Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-screen-xl mx-auto">
            {typeItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative w-full"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => {handleOpenDialog(item.id)}}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>         
                <button className={`relative w-full bg-gradient-to-r ${item.color} hover:bg-gradient-to-r hover:${item.hoverColor} rounded-2xl p-16 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-white/10`}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <item.icon className="w-8 h-8 text-white" />
                    </div> */}
                    
                    <div>
                      <h3 className="text-5xl font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      {/* <p className="text-white/80 text-sm">
                        {item.subtitle}
                      </p> */}
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
        </main> 
        : pageState == 'dryrun' ?
        <main className="relative z-10 max-w-screen-xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16 py-12 px-32 rounded-lg bg-black/10 backdrop-blur-sm border border-white/20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-14 tracking-tight drop-shadow-2xl">
              TRUCK LOADING SYSTEM
            </h2>
            <p className="text-5xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
              ลงทะเบียนจองคิว Dry Run
            </p>
          </div>
          {/* Menu Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-screen-xl mx-auto">
            {typeDryrunItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative w-full"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => {handleOpenDryRunDialog(item.id)}}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>         
                <button className={`relative w-full bg-gradient-to-r ${item.color} hover:bg-gradient-to-r hover:${item.hoverColor} rounded-2xl p-16 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-white/10`}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <item.icon className="w-8 h-8 text-white" />
                    </div> */}
                    
                    <div>
                      <h3 className="text-5xl font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-white/80 text-5xl">
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
        </main> 
        : <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
            <PlateDialog open={openQueueDialog} mode={pageState} title={dialogTitle} topic={dialogTopic} ishead={dialogIsHead} isDryRun={dryrunMode} truck_type={seletedTruck} onClose={handleCloseQueueDialog} onSave={handleSaveDialog}></PlateDialog>
            <OrderDialog open={openDryRunDialog} mode={'single'} title={dialogTitle} onClose={handleCloseQueueDialog} onSave={handleSaveDialog}></OrderDialog>
            {/* <TruckQueueDialog open={openQueueDialog} mode={'multiple'} onClose={handleCloseQueueDialog} onSave={handleSaveDialog}></TruckQueueDialog>  */}
            {/* <TruckQueueDialog open={openDryRunDialog} mode={'single'} onClose={handleCloseQueueDialog} onSave={handleSaveDialog}></TruckQueueDialog>  */}
            <TruckDataDialog open={openDataDialog} data={queueData} mode={pageState} type={queueDataType} truck_type={seletedTruck} onClose={handleCloseQueueDialog}></TruckDataDialog>
        </main>
      }

      <footer className="relative bg-black/20 backdrop-blur-sm border-t border-white/20">
        <div className="mx-auto px-16 py-6">
          <div className="flex items-center justify-between">
            <div className="text-white/80 text-sm drop-shadow">
              © 2025 PTT LNG Truck Loading System
            </div>
            <div className="flex items-center space-x-4 text-white/80 text-sm drop-shadow">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>System Online</span>
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;