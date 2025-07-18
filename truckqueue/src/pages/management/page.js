import React, { useState, useEffect } from 'react';
import { Truck, Settings, Clock, MapPin, Gauge, Fuel, Verified, Loader2, Loader } from 'lucide-react';
import { useRouting } from '../../hooks/routing-hook';
import TruckModel from '../../components/truck/truck-model';
import Slider from '@mui/material/Slider';
import QueueManageDialog from '../../components/manage-dialog/dialog';
import ManageDialog from '../../components/confirm-dialog/dialog';
import QueueListDialog from '../../components/queuelist-dialog/dialog';

const CarrierManagement = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [ bayData, setBayData ] = useState([]);
  const [ selectBayData, setSelectBayData ] = useState(null);
  const [ selectBtnType, setSelectBtnType ] = useState('');
  const [ openDataDialog, setOpenDataDialog ] = useState(false);
  const [ openQueueDialog, setOpenQueueDialog ] = useState(false);
  const [ openModeDialog, setOpenModeDialog ] = useState(false);
  const [selectedMode, setSelectedMode] = useState('Online');
  const [statusMode, setStatusMode] = useState(true);
  const [selectedAction, setSelectedAction] = useState('');
  const { navigatePage } = useRouting();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      //console.log('Updating bay data every second');
      setBayData(prevData => prevData.map(c => 
        c.id === c.id && c.counter === 20 && c.state === 'finished' && c.weight < 1000 ? 
          { ...c, state: 'free', status: 'ว่าง', timeLoading: '',weight: 0, loading: null, counter: 0, verified: false } : 
            c.state === 'finished' && c.weight < 1000 ?  
            { ...c, counter: c.counter ? c.counter + 1 : 1 } : c
      ));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const getRandomCarriers = () => {
      const shuffled = [...carriers].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 4);
    };

    const timer = setInterval(() => {
      // const randomCarriers = getRandomCarriers();
      // setBayData(randomCarriers);
      //setBayData(carriers.slice(0, 4)); 
    }, 10000);
    setBayData(carriers.slice(0, 4)); 
    return () => clearInterval(timer);
  }, []);

  const downLoadBayData = (id) => {
    const selectedCarrier = carriers.find(carrier => carrier.id === id);
    console.log('Selected Carrier:', selectedCarrier);
    if (selectedCarrier) {
      setBayData(prevData =>
        prevData.map(carrier => 
          carrier.id === id && carrier.state === 'finished' ? 
            { ...carrier, weight: 500, counter: 0 } 
          : carrier.id === id && carrier.state === 'loading' ? 
            { ...carrier, loading: carrier.maxLoading, counter: 0, state: 'finished', status: 'โหลดเสร็จสิ้น', timeLoading: '10/10 นาที' } 
          : carrier.id === id && carrier.state === 'free' ?
            { ...carrier, state: 'pending', status: 'เรียกคิว', loading: 5000, counter: 0, carrier: 'CARRIER-TEST1', weight: 340, timeLoading: '' }
          : carrier.id === id && carrier.state === 'pending' ?
            { ...carrier, weight: 2001, counter: 0, state: 'loading', status: 'กำลังโหลด', loading: 2001, timeLoading: '5/10 นาที', verified: true, carrier: 'THAI SPECIAL GAS CO., LTD' }
          :  carrier.id === id && carrier.state === 'dry-run' ? 
            { ...carrier, state: 'free', status: 'ว่าง', timeLoading: '',weight: 0, loading: null, counter: 0, verified: false } 
          : carrier
        )
      );
    }
  };

  const carriers = [
    {
      id: 'A',
      status: 'โหลดเสร็จสิ้น',
      weight: 17221,
      loading: 17221,
      maxLoading: 17221, 
      timeLoading: '10/10 นาที',
      state: 'finished',
      carrier: 'IBCLNG',
      verified: true,
      frontlicense: '54-1564',
      rearlicense: '54-1563',
      queuenumber: 21,
      usage: 13,
      mode: 'OPERATING MODE'
    },
    {
      id: 'B',
      status: 'กำลังโหลด',
      weight: 7611,
      loading: 7611,
      maxLoading: 17221, 
      timeLoading: '5/10 นาที',
      state: 'loading',
      carrier: 'THAI SPECIAL GAS CO., LTD',
      verified: true,
      frontlicense: '67-6512',
      rearlicense: '67-6252',
      queuenumber: 12,
      usage: 1,
      mode: 'OPERATING MODE'
    },
    // {
    //   id: 'C',
    //   status: 'ว่าง',
    //   weight: 0,
    //   loading: null,
    //   maxLoading: 17221, 
    //   timeLoading: '',
    //   state: 'free',
    //   carrier: '',
    //   verified: false,
    //   frontlicense: '67-9607',
    //   rearlicense: '53-1217',
    //   queuenumber: 0,
    //   usage: 0,
    //   mode: 'OPERATING MODE'

    // },
    // {
    //   id: 'D',
    //   status: 'เรียกคิว',
    //   weight: 0,
    //   loading: 5000,
    //   maxLoading: 17221, 
    //   timeLoading: '',
    //   state: 'pending',
    //   carrier: 'CARRIER-TEST1',
    //   verified: false,
    //   frontlicense: '67-9607',
    //   rearlicense: '53-1217',
    //   queuenumber: 16,
    //   usage: 3,
    //   mode: 'OPERATING MODE'
    // },
    {
      id: 'C',
      status: 'อยู่ระหว่างซ่อมบำรุง',
      weight: 0,
      loading: null,
      maxLoading: 17221, 
      timeLoading: '',
      state: 'maintenance',
      carrier: '',
      verified: true,
      frontlicense: '403 83-1985',
      rearlicense: '5002 83-4329',
      queuenumber: 3,
      usage: 0,
      mode: 'MAINTENANCE MODE'
    },
    {
      id: 'D',
      status: 'Dry Run',
      weight: 0,
      loading: 0,
      maxLoading: 17221, 
      timeLoading: '',
      state: 'dry-run',
      carrier: 'CARRIER-TEST1',
      verified: true,
      frontlicense: '67-9607',
      rearlicense: '53-1217',
      queuenumber: 4,
      usage: 1,
      mode: 'OPERATING MODE'
    },
    
  ];

  const upcomingSlots = [
    { id: 4, available: true },
    { id: 5, available: true },
    { id: 6, available: true },
    { id: 7, available: false }
  ];

  const formatDate = (date) => {
    return date.toLocaleDateString('th-TH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="max-w-screen mx-auto w-full min-h-screen h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-4 flex flex-col justify-between">
      {/* Header */}
      <div className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4" onClick={() => navigatePage('/overview')}>
            <div className="bg-white p-3 rounded-xl shadow-lg">
              <Truck className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Queue Management</h1>
              <p className="text-xl text-slate-600">ระบบบริหารคิวรถขนส่ง</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-slate-800">
              {formatTime(currentTime)}
            </div>
            <div className="text-xl text-slate-600">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>
      </div>

      {/* Active Carriers */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
        {bayData.map((carrier) => (
          <div
            onClick={() => setSelectBayData(carrier)}
            key={carrier.id}
            className={`bg-${ 
               carrier.state === 'finished' ? 'emerald-50' : 
                    carrier.state === 'loading' ? 'amber-50' : 
                      carrier.state === 'maintenance' ? 'indigo-100' : 
                        carrier.state === 'dry-run' ? 'blue-50' : 
                         carrier.state === 'pending' ? 'red-50' : 'slate-50'
            } rounded-2xl px-6 py-4 shadow-lg border border-white/50`}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-3" onClick={() => downLoadBayData(carrier.id)}>
                <div
                  key={carrier.id} 
                  className={`w-16 h-16 bg-gradient-to-r ${ 
                     carrier.state === 'finished' ? 'from-emerald-400 to-emerald-600' : 
                          carrier.state === 'loading' ? 'from-amber-400 to-orange-500' : 
                            carrier.state === 'maintenance' ? 'from-indigo-400 to-indigo-600' : 
                              carrier.state === 'dry-run' ? 'from-blue-400 to-blue-600' :
                                carrier.state === 'pending' ? 'from-red-400 to-red-600' : 'from-slate-400 to-slate-600'
                    } rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-lg`}>
                  {carrier.id}
                </div>
                <div className={`text-xl font-bold ${ 
                    carrier.state === 'finished' ? 'text-emerald-800' : 
                          carrier.state === 'loading' ? 'text-amber-800' : 
                            carrier.state === 'maintenance' ? 'text-indigo-800' : 
                              carrier.state === 'dry-run' ? 'text-blue-800 ' :
                                carrier.state === 'pending' ? 'text-red-800' : 'text-slate-800'
                }`}>BAYLOAD: {carrier.usage}</div>
              </div>
              {
                carrier.state === 'maintenance' ?
                <div className="bg-white/80 rounded-lg p-4 shadow-md mx-10">
                    <Settings className="w-14 h-14 text-indigo-500 " style={{animationDuration: '4s'}} />
                </div> : carrier.state === 'free' ?  
                <div className="bg-white/80 rounded-lg p-4 shadow-md mx-10">
                    <Loader className="w-12 h-12 text-slate-500" style={{animationDuration: '4s'}} />
                </div>  :
                <div className="text-center box-border">
                  <div className="text-3xl font-bold text-slate-700 pb-2">คิวที่ {carrier.id === 'A' ? '1' : carrier.id === 'B' ? '2' : carrier.id === 'D' ? '3' : ''}</div>
                  <div className="text-lg font-semibold text-slate-500">ทะเบียนหน้า 67-6255</div>
                  <div className="text-lg font-semibold text-slate-500">ทะเบียนหลัง 67-6520</div>
                </div>
              }
              <div className={`w-1/5 h-full flex flex-col item-center justify-between bg-white/60 backdrop-blur-sm rounded-xl px-4 py-4 shadow-md border border-white/30`}>
                {
                  carrier.loading !== null && carrier.maxLoading !== null && carrier.verified ? 
                  <div className=''>
                    <Slider
                      sx={{
                        height: 24,
                        color: 'transparent',
                        '& .MuiSlider-track': {
                          height: 24,
                          borderRadius: 4,
                          backgroundImage: `linear-gradient(to right, ${
                            carrier.state === 'finished' ? '#34d399' : 
                              carrier.state === 'loading' ? '#fbbf24' : '#e0e0e0'}, ${
                                    carrier.state === 'finished' ? '#059669' : 
                                      carrier.state === 'loading' ? '#f97316' : '#e0e0e0'
                          })`,
                        },
                        '& .MuiSlider-rail': {
                          height: 24,
                          borderRadius: 4,
                          backgroundColor: 'rgba(0,0,0,0.2)',
                        },
                        '& .MuiSlider-thumb': {
                          height: 32,
                          width: 32,
                          backgroundColor: '#fff',
                          border: `4px solid ${
                            carrier.state === 'finished' ? '#059669' : 
                            carrier.state === 'loading' ? '#f97316' : '#e0e0e0'
                          }`,
                          boxShadow: '0px 2px 2px rgba(0,0,0,0.2)',
                        },
                        '& .MuiSlider-valueLabel': {
                          backgroundColor: `${
                            carrier.state === 'finished' ? '#059669' : 
                            carrier.state === 'loading' ? '#f97316' : '#e0e0e0'
                          }`,
                          color: '#fff',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          fontSize: 16,
                          padding: '4px 8px',
                          top: -30,
                          // '&:before': {
                          //   display: 'none', // เอาลูกศรออก
                          // },
                          transform: 'translateY(-50%) scale(1) !important', 
                        },
                      }}
                      aria-label="Always visible"
                      defaultValue={0}
                      value={carrier.loading}
                      min={0}
                      max={carrier.maxLoading+(carrier.maxLoading*0.05)}
                      getAriaValueText={(value) => `${carrier.loading} / ${carrier.maxLoading} kg.`}
                      valueLabelFormat={(value) => `${carrier.loading} / ${carrier.maxLoading} kg.`}
                      step={10}
                      valueLabelDisplay="on"
                    />
                  </div> : null
                }
                <div className="">
                  <div className='flex items-center justify-between'>
                    <div className={`text-lg font-semibold ${ 
                      carrier.state === 'finished' ? 'text-emerald-800' : 
                          carrier.state === 'loading' ? 'text-amber-800' : 
                            carrier.state === 'maintenance' ? 'text-indigo-800' : 
                              carrier.state === 'dry-run' ? 'text-blue-800 ' :
                                carrier.state === 'pending' ? 'text-red-800' : 'text-slate-800'
                    }`}>สถานะ: {carrier.status}</div>
                    <div className={`text-lg font-semibold ${ 
                      carrier.state === 'finished' ? 'text-emerald-800' : 
                          carrier.state === 'loading' ? 'text-amber-800' : 
                            carrier.state === 'maintenance' ? 'text-indigo-800' : 
                              carrier.state === 'dry-run' ? 'text-blue-800 ' :
                                carrier.state === 'pending' ? 'text-red-800' : 'text-slate-800'
                    }`}>{carrier.timeLoading}</div>
                  </div>
                </div>
              </div>
              <div className={`w-1/5 min-h-24 h-full relative mr-36 ${ carrier.state === 'free' ? 'invisible' : '' }`}>
                { carrier.state === 'maintenance' ? null : 
                  carrier.state === 'free' ? 
                  <div className='w-full absolute top-1/2 left-0 -translate-y-1/2 flex flex-col items-center justify-center h-auto gap-2 overflow-x-hidden bg-white/60 backdrop-blur-sm rounded-xl px-4 py-1 shadow-md border border-white/30'>
                    <div className="animate-truck-exit">
                        <TruckModel key={carrier.id} />
                      </div>
                  </div> : 
                  <div className='w-full absolute top-1/2 left-0 -translate-y-1/2 flex flex-col items-center justify-center h-auto gap-1 overflow-x-hidden bg-white/60 backdrop-blur-sm rounded-xl px-4 py-1 shadow-md border border-white/30'>
                    {carrier.state != 'pending' ? (
                      <div className="animate-truck-enter">
                        <TruckModel key={carrier.id} />
                      </div>
                    ) : carrier.loading >= 2000 ? (
                      <div className="animate-truck-enter">
                        <TruckModel key={carrier.id} />
                      </div>
                    ) : null}
                    <div className="font-semibold text-slate-900">
                      {carrier.carrier}
                    </div>
                  </div>
                }
              </div>
              <div className='w-1/5 min-h-24 h-full grid grid-cols-2 gap-4 cursor-pointer'>
                <div className={`w-full h-full col-span-2 grid place-items-center text-center text-base font-bold rounded-md border-2 
                  ${ carrier.state === 'maintenance' ? 'text-slate-200 bg-indigo-500 border-white' : 'text-black bg-emerald-400 border-emerald-600' } shadow-black/30 shadow-lg`}>
                  <div>{carrier.mode}</div>
                </div>
                <div onClick={() => {
                    setSelectBtnType('MANAGEMENT');
                    setOpenDataDialog(true);
                  }} className={`w-full h-full grid place-items-center text-base font-bold rounded-md
                  ${ carrier.state === 'xxxxx' ? 'text-slate-200 bg-indigo-500 border-white' : 'text-slate-200 border-slate-200 bg-black/60' } shadow-black/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                  <div>Management</div>
                </div>
                <div onClick={() => {                  
                    setSelectBtnType('SETTING');
                    setOpenDataDialog(true);
                  }} className={`w-full h-full grid place-items-center text-base font-bold rounded-md text-slate-200 border-slate-200 bg-black/60 shadow-black/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                  <div>Setting</div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <QueueManageDialog open={openDataDialog} data={selectBayData} type={selectBtnType} onClose={() => {
          setOpenDataDialog(false);
          setSelectBtnType('');
        }}></QueueManageDialog>
      </div>

      {/* Upcoming Slots */}
      <div className="bg-white rounded-2xl shadow-xl p-4">
        <div className="grid grid-cols-6 gap-4">
          <div
            className={`p-2 rounded-xl border-2 transition-all duration-300 ${
              false 
                ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300' 
                : 'border-slate-300 bg-slate-100'
            }`}
          >
            <div className="div flex flex-col items-center justify-around h-full">
              <div className={`text-3xl font-bold mb-2 ${true ? 'text-slate-700' : 'text-slate-900'}`}>
                รายการคิว
              </div>
              <div className='w-full flex items-center gap-2 cursor-pointer'>
                <div onClick={() => {
                  setSelectedMode(!statusMode ? 'Online Mode' : 'Offline Mode');
                  setOpenModeDialog(true)
                }} className={`w-full py-1.5 text-sm text-center font-bold rounded-md  ${ !statusMode ? 'text-slate-200 bg-red-500 border-white' : 'text-black bg-emerald-400 border-emerald-600' } shadow-black/30 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>{statusMode ? 'Online' : 'Offline'} Mode</div>
                <div onClick={() => setOpenQueueDialog(true)} className='w-full py-1.5 text-sm text-center font-bold rounded-md text-slate-200 border-slate-200 bg-black/50 shadow-black/30 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>Cancel Queue</div>
              </div>
            </div>
          </div>
          {upcomingSlots.map((slot) => (
            <div
              key={slot.id}
              className={`p-2 rounded-xl border-2 transition-all duration-300 ${
                slot.available 
                  ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300' 
                  : 'border-slate-300 bg-slate-100'
              }`}
            >
              <div className="div flex items-center justify-around h-full">
                <div className={`text-2xl font-bold mb-2 ${slot.available ? 'text-slate-700' : 'text-slate-900'}`}>
                  คิวที่ {slot.id}
                </div>
                
                <div className="space-y-2">
                  <div className="text-slate-600 text-base font-semibold">ทะเบียนหน้า 67-6255</div>
                  <div className="text-slate-600 text-base font-semibold">ทะเบียนหลัง 67-6520</div>
                  <div className="border-t border-slate-200 pt-3 mt-3">
                    <div className="text-slate-500 text-base font-semibold">รอประมาณ 30 นาที</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div
            className={`p-2 col-start-6 rounded-xl border-2 transition-all duration-300 ${
              false 
                ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300' 
                : 'border-slate-300 bg-slate-100'
            }`}
          >
            <div className="flex flex-col items-center justify-between h-full p-2">
              <div className='w-full text-2xl text-center font-bold text-slate-600'>Bay Usage: {bayData.reduce((acc, cur) => { return acc += cur.usage }, 0)}</div>
              <div className='w-full flex items-center gap-3 cursor-pointer'>
                <div className='w-full py-1 text-sm text-center font-bold rounded-md text-slate-200 border-slate-200 bg-black/50 shadow-black/30 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>D</div>
                <div className='w-full py-1 text-sm text-center font-bold rounded-md text-slate-200 border-slate-200 bg-black/50 shadow-black/30 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>M</div>
                <div className='w-full py-1 text-sm text-center font-bold rounded-md text-slate-200 border-slate-200 bg-black/50 shadow-black/30 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>Y</div>
              </div>
            </div>
          </div>
        </div>
        <QueueListDialog open={openQueueDialog} mode={'cancle'} onClose={() => {setOpenQueueDialog(false)}}></QueueListDialog>
        <ManageDialog opens={openModeDialog} selectedAction={selectedMode} count={0} onSave={(st) => {
          console.log('dialog result: '+st);
          setOpenModeDialog(false);
          setSelectedMode('');
          if(st){
            setStatusMode(!statusMode);
          }
        }}></ManageDialog>
      </div>
    </div>
  );
};

export default CarrierManagement;