import React, { useState, useEffect } from 'react';
import { Truck, Settings, Clock, MapPin, Gauge, Fuel, Verified, Loader2, Loader, TriangleAlert, TriangleAlertIcon } from 'lucide-react';
import { useRouting } from '../../hooks/routing-hook';
import TruckModel from '../../components/truck/truck-model';
import Slider from '@mui/material/Slider';
import alertImg from '../../assets/warning.png';

const CarrierDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [ bayData, setBayData ] = useState([]);
  const [ screenratio, setScreenRatio ] = useState(0);
  const { navigatePage } = useRouting();

  useEffect(() => {
    const screen = window.innerWidth/window.innerHeight;
    console.log(screen)
    setScreenRatio(screen);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      console.log('Updating bay data every second');
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
            { ...carrier, state: 'free', status: 'ว่าง', timeLoading: '',weight: 0, loading: null, counter: 0, verified: false, carrier: 'DRY RUN' } 
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
      queuenumber: 1,
      product: 'LNG',
      abnormal: false,
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
      queuenumber: 2,
      product: 'LNG',
      abnormal: true,
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
    //   product: 'LNG',
    //   abnormal: false,
    // },
    // {
    //   id: 'D',
    //   status: 'เรียกคิว',
    //   weight: 0,
    //   loading: 1000,
    //   maxLoading: 17221, 
    //   timeLoading: '',
    //   state: 'pending',
    //   verified: false,
    //   frontlicense: '67-9607',
    //   rearlicense: '53-1217',
    //   queuenumber: 16,
    //   carrier: 'CARRIER-TEST1',
    //   product: 'LNG',
    //   abnormal: false,
    // },
    // {
    //   id: 'C',
    //   status: 'อยู่ระหว่างซ่อมบำรุง',
    //   weight: 0,
    //   loading: null,
    //   maxLoading: 17221, 
    //   timeLoading: '',
    //   state: 'maintenance',
    //   carrier: '',
    //   verified: true,
    //   frontlicense: '403 83-1985',
    //   rearlicense: '5002 83-4329',
    //   queuenumber: 13,
    //   product: 'LNG',
    //   abnormal: false,
    // },
    // {
    //   id: 'D',
    //   status: 'Dry Run',
    //   weight: 0,
    //   loading: 0,
    //   maxLoading: 17221, 
    //   timeLoading: '',
    //   state: 'dry-run',
    //   carrier: 'DRY RUN',
    //   verified: true,
    //   frontlicense: '67-9607',
    //   rearlicense: '53-1217',
    //   queuenumber: 4,
    //   product: 'LNG',
    //   abnormal: false,
    // },
    {
      id: 'E',
      status: 'ว่าง',
      weight: 0,
      loading: null,
      maxLoading: 17221, 
      timeLoading: '',
      state: 'free',
      carrier: '',
      verified: false,
      frontlicense: '67-9607',
      rearlicense: '53-1217',
      queuenumber: 10,
      product: 'LNG',
      abnormal: false,
    },
    {
      id: 'F',
      status: 'เรียกคิว',
      weight: 0,
      loading: 1000,
      maxLoading: 17221, 
      timeLoading: '',
      state: 'pending',
      verified: false,
      frontlicense: '67-9607',
      rearlicense: '53-1217',
      queuenumber: 16,
      carrier: 'CARRIER-TEST1',
      product: 'LNG',
      abnormal: false,
    }
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

  const [text, setText] = useState('queue tee sibjet pai tee bay A');

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text to speech!');
    }
  };

  return (
    <div>
      {
        screenratio >= 2 ?
        <div className="max-w-screen mx-auto w-full min-h-screen h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 flex flex-col justify-around ">
          {/* Header */}
          <div className="">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4" onClick={() => navigatePage('/overview')}>
                <div className="bg-white p-3 rounded-xl shadow-lg">
                  <Truck className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">Queue Dashboard</h1>
                  <p className="text-xl text-slate-600">รายการสถานะคิว</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-mono font-bold text-slate-800">
                  {currentTime.toLocaleTimeString('th-TH')}
                </div>
                <div className="text-xl text-slate-600">
                 {formatDate(currentTime)}
                </div>
              </div>
            </div>
          </div>

          {/* Active Carriers */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {bayData.map((carrier) => (
              <div
                key={carrier.id}
                className={`${ 
                  carrier.state === 'finished' ? 'bg-emerald-50' : 
                    carrier.state === 'loading' ? 'bg-amber-50' : 
                      carrier.state === 'maintenance' ? 'bg-red-100' : 
                        carrier.state === 'dry-run' ? 'bg-blue-50' : 
                         carrier.state === 'pending' ? 'bg-indigo-200 animate-blink' : 'bg-slate-50'
                } rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${ carrier.abnormal ? 'border-4 border-solid border-red-500' : 'border border-white/50' } `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3" onClick={() => downLoadBayData(carrier.id)}>
                    <div
                      key={carrier.id} 
                      className={`w-24 h-24 bg-gradient-to-r ${ 
                        carrier.state === 'finished' ? 'from-emerald-400 to-emerald-600' : 
                          carrier.state === 'loading' ? 'from-amber-400 to-orange-500' : 
                            carrier.state === 'maintenance' ? 'from-red-400 to-red-600': 
                              carrier.state === 'dry-run' ? 'from-blue-400 to-blue-600' :
                                carrier.state === 'pending' ? 'from-indigo-400 to-indigo-600'  : 'from-slate-400 to-slate-600'
                        } rounded-xl flex items-center justify-center text-white font-bold text-6xl shadow-lg `}>
                      {carrier.id}
                    </div>
                  </div>
                  <div className='w-2/5 h-full flex flex-col item-center justify-between '>
                    {
                      carrier.loading !== null && carrier.maxLoading !== null && carrier.verified &&  carrier.state != 'maintenance' &&  carrier.state != 'dry-run' ? 
                      <div>
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
                          max={carrier.maxLoading}
                          getAriaValueText={(value) => `${carrier.loading} / ${carrier.maxLoading} kg.`}
                          valueLabelFormat={(value) => `${carrier.loading} / ${carrier.maxLoading} kg.`}
                          step={10}
                          valueLabelDisplay="on"
                        />
                      </div> : null
                    }
                    <div className='flex items-center justify-between'>
                      <div className={`text-2xl font-semibold ${ 
                        carrier.state === 'finished' ? 'text-emerald-800' : 
                          carrier.state === 'loading' ? 'text-amber-800' : 
                            carrier.state === 'maintenance' ? 'text-red-800 -translate-x-7' : 
                              carrier.state === 'dry-run' ? 'text-blue-800 ' :
                                carrier.state === 'pending' ? 'text-indigo-800' : 'text-slate-800 -translate-x-7'
                      }`}>สถานะ: {carrier.status}</div>
                      <div className={`text-2xl font-semibold ${ 
                        carrier.state === 'finished' ? 'text-emerald-800' : 
                          carrier.state === 'loading' ? 'text-amber-800' : 
                            carrier.state === 'maintenance' ? 'text-indigo-800' : 
                              carrier.state === 'dry-run' ? 'text-blue-800' : 'text-slate-800'
                      }`}> { carrier.timeLoading } </div>
                    </div>
                  </div>
                  <div className='w-1/4 min-h-24 h-full relative '>
                    { carrier.abnormal &&(
                      <div>
                        <div className="">
                            <img src={alertImg} alt='truck' className='h-24' />
                        </div> 
                      </div>
                    )}
                  { carrier.state === 'maintenance' ? 
                    <div className='absolute top-1/2 left-1/3 -translate-y-1/2 flex flex-col items-center justify-center h-auto gap-2 overflow-x-hidden'>
                      <div className="bg-white/80 rounded-lg p-2 shadow-md">
                          {/* <Settings className="w-24 h-24 text-red-500" style={{animationDuration: '4s'}} /> */}
                          <svg className='w-24 h-24' width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.5 77.5L15 94L0 95V124L15 125.5L19.5 143.5L7.5 152.5L21.5 177L36 171L49 184L43 198L67 211.5L77 200.5L94.5 205L95.5 219.5H124.5L126 205L143 200L153.5 212.5L165 205L135.5 176C122.487 181.129 114.731 181.778 100.5 181C87.4298 176.939 80.2716 173.869 68 166.5C58.7644 159.257 54.2153 154.441 47.5 144C40.3204 129.649 38.7715 120.96 40 104.5C41.9083 88.1972 44.7655 79.7368 54.5 66.5C66.5317 51.4697 76.0931 45.7928 97.5 40C123.014 37.9766 134.599 41.5314 152 53.5C168.484 67.1568 174.175 76.5059 179.5 95.5C181.155 112.083 180.077 120.728 175 135.5L205 164L212.5 154L200.5 143L204.5 126L219.5 124.5L219 95.5L204.5 94.5L200 76.5L212.5 66.5L198 42.5L183.5 49.5L170.5 35L177 22L153.5 7.5L143 20.5L125 14L124.5 0H95.5L95 14L76 19L66.5 7L42.5 22L48.5 35L35 48.5L22 42.5L7 67.5L19.5 77.5Z" fill="#FF0000"/>
                            <path d="M103.999 121.999L74.4994 92.4987C70.6324 105.408 70.4094 112.633 72.9994 125.499C78.5881 134.907 82.7779 138.775 91.4994 143.999C104.483 147.285 111.522 147.948 123.499 146.499L190.999 212.499C208.943 212.784 215.544 209.642 212 189.5L211.999 189.499L146.999 124.499C148.577 111.915 148.582 104.623 143.999 92.4987C137.681 81.3072 132.836 76.397 119.999 71.9987C108.695 71.1535 102.701 71.8839 92.4994 74.9987L122.499 103.499V113.999L113.999 122.499L103.999 121.999Z" fill="#FF0000"/>
                            </svg>
                      </div> 
                    </div> : 
                    carrier.state === 'free' ? 
                    <div className='absolute top-1/2 left-1/3 -translate-y-1/2 flex flex-col items-center justify-center h-auto gap-2 overflow-x-hidden '>
                      <div className="bg-white/80 rounded-lg p-2 shadow-md">
                          <Loader className="w-24 h-24 text-slate-500" style={{animationDuration: '4s'}} />
                      </div> 
                    </div> : 
                    <div className='absolute top-1/2 left-1/3 -translate-y-1/2 flex flex-col items-center justify-center h-auto gap-2 overflow-x-hidden'>
                      {carrier.state != 'pending' ? (
                        <div className="animate-truck-enter">
                          <TruckModel key={carrier.id} product={carrier.product}/>
                        </div>
                      ) : carrier.loading >= 2000 ? (
                        <div className="animate-truck-enter">
                          <TruckModel key={carrier.id} product={carrier.product}/>
                        </div>
                      ) : 
                        <div className="animate-truck-enter invisible">
                          <TruckModel key={carrier.id} product={carrier.product}/>
                        </div>
                      }
                      <div className="bg-white/80 rounded-lg shadow-md px-4 border border-slate-300 font-semibold">
                        {carrier.carrier}
                      </div>
                    </div>
                  }
                  </div>
                  {
                    carrier.state === 'maintenance' ?
                    <div className='flex invisible'>
                      <div className='w-44'></div>
                      <div className="bg-white/80 rounded-lg p-4 shadow-md">
                          <Settings className="w-12 h-12 text-indigo-500" style={{animationDuration: '4s'}} />
                      </div> 
                    </div>
                    : carrier.state === 'free' ?  
                      <div className='flex invisible'>
                        <div className='w-44'></div>
                        <div className="bg-white/80 rounded-lg p-4 shadow-md">
                            <Loader className="w-12 h-12 text-slate-500" style={{animationDuration: '4s'}} />
                        </div> 
                      </div>
                   :
                    <div className="flex items-center gap-4 h-full box-border scale-90 ">
                      <div className="text-4xl font-bold text-slate-700 bg-white px-4 py-4 rounded-lg shadow-md h-24 flex flex-col justify-center items-center">
                        <div>คิวที่ {carrier.queuenumber}</div>
                      </div>
                      <div className='text-right '>
                        <div className="text-3xl font-semibold text-slate-600 bg-white px-2 py-1 rounded-md shadow-md">หน้า 67-6255</div>
                        <div className="text-3xl font-semibold text-slate-600 mt-2 bg-white px-2 py-1 rounded-md shadow-md">หลัง 67-6520</div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Slots */}
          <div className="bg-white rounded-2xl shadow-xl p-4">
            {/* <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-600" />
              คิวถัดไป
            </h2> */}
            
            <div className="grid grid-cols-5 gap-4">
              <div
                className={`p-2 rounded-xl border-2 transition-all duration-300 ${
                  false 
                    ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300' 
                    : 'border-slate-300 bg-slate-100'
                }`}
              >
                <div className="div flex items-center justify-around h-full" onClick={() => handleSpeak()}>
                  <div className={`text-3xl font-bold mb-2 ${true ? 'text-slate-700' : 'text-slate-900'}`}>
                    คิวที่ถัดไป
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
                    <div className={`text-3xl font-bold mb-2 ${slot.available ? 'text-slate-700' : 'text-slate-900'}`}>
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
            </div>
          </div>
        </div> 
        : 
        <div className="max-w-screen mx-auto w-full min-h-screen h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 flex flex-col justify-around ">
          {/* Header */}
          <div className="">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4" onClick={() => navigatePage('/')}>
                <div className="bg-white p-3 rounded-xl shadow-lg">
                  <Truck className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">Queue Dashboard</h1>
                  <p className="text-xl text-slate-600">รายการสถานะคิว</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-slate-800">
                  {currentTime.toLocaleTimeString('th-TH')}
                </div>
                <div className="text-xl text-slate-600">
                  {formatDate(currentTime)}
                </div>
              </div>
            </div>
          </div>
          {/* Active Carriers */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
            {bayData.map((carrier) => (
              <div
                key={carrier.id}
                className={`${ 
                  carrier.state === 'finished' ? 'bg-emerald-50' : 
                    carrier.state === 'loading' ? 'bg-amber-50' : 
                      carrier.state === 'maintenance' ? 'bg-indigo-100' : 
                        carrier.state === 'dry-run' ? 'bg-blue-50' : 
                         carrier.state === 'pending' ? 'bg-red-200 animate-blink' : 'bg-slate-50'
                } rounded-2xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50`}
              >
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-3" onClick={() => downLoadBayData(carrier.id)}>
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
                  </div>
                  <div className='w-2/5 h-full flex flex-col item-center justify-between scale-75'>
                    {
                      carrier.loading !== null && carrier.maxLoading !== null && carrier.verified ? 
                      <div>
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
                          max={carrier.maxLoading}
                          getAriaValueText={(value) => `${carrier.loading} / ${carrier.maxLoading} kg.`}
                          valueLabelFormat={(value) => `${carrier.loading} / ${carrier.maxLoading} kg.`}
                          step={10}
                          valueLabelDisplay="on"
                        />
                      </div> : null
                    }
                    <div className='flex items-center justify-between'>
                      <div className={`text-2xl font-semibold ${ 
                        carrier.state === 'finished' ? 'text-emerald-800' : 
                          carrier.state === 'loading' ? 'text-amber-800' : 
                            carrier.state === 'maintenance' ? 'text-indigo-800 -translate-x-7' : 
                              carrier.state === 'dry-run' ? 'text-blue-800 ' :
                                carrier.state === 'pending' ? 'text-red-800' : 'text-slate-800 -translate-x-7'
                      }`}>สถานะ: {carrier.status}</div>
                      <div className={`text-2xl font-semibold ${ 
                        carrier.state === 'finished' ? 'text-emerald-800' : 
                          carrier.state === 'loading' ? 'text-amber-800' : 
                            carrier.state === 'maintenance' ? 'text-indigo-800' : 
                              carrier.state === 'dry-run' ? 'text-blue-800' : 'text-slate-800'
                      }`}> { carrier.timeLoading } </div>
                    </div>
                  </div>
                  <div className='w-1/3 min-h-24 h-full relative scale-75'>
                  {/* { carrier.state === 'maintenance' ? 
                    null : carrier.state === 'free' ? null : 
                    <div className='absolute top-1/2 left-1/3 -translate-y-1/2 flex flex-col items-center justify-center h-auto gap-2'>
                        { carrier.state != 'pending' ? 
                          <TruckModel key={carrier.id}></TruckModel> : 
                          carrier.loading >= 2000 ? 
                          <TruckModel key={carrier.id}></TruckModel> 
                          : null
                        }
                        <div className="bg-white/80 rounded-lg shadow-md px-4 border border-slate-300 font-semibold">{carrier.carrier }</div>
                    </div>
                  } */}
                  { carrier.state === 'maintenance' ? null : 
                    carrier.state === 'free' ? 
                    <div className='absolute top-1/2 left-1/3 -translate-y-1/2 flex flex-col items-center justify-center h-auto gap-2 overflow-x-hidden'>
                      <div className="animate-truck-exit">
                          <TruckModel key={carrier.id} />
                        </div>
                    </div> : 
                    <div className='absolute top-1/2 left-1/3 -translate-y-1/2 flex flex-col items-center justify-center h-auto gap-2 overflow-x-hidden'>
                      {carrier.state != 'pending' ? (
                        <div className="animate-truck-enter">
                          <TruckModel key={carrier.id} />
                        </div>
                      ) : carrier.loading >= 2000 ? (
                        <div className="animate-truck-enter">
                          <TruckModel key={carrier.id} />
                        </div>
                      ) : 
                        <div className="animate-truck-enter invisible">
                          <TruckModel key={carrier.id} />
                        </div>
                      }
                      <div className="bg-white/80 rounded-lg shadow-md px-4 border border-slate-300 font-semibold">
                        {carrier.carrier}
                      </div>
                    </div>
                  }
                  </div>
                  {
                    carrier.state === 'maintenance' ?
                    <div className='flex'>
                      <div className='w-44'></div>
                      <div className="bg-white/80 rounded-lg p-4 shadow-md">
                        <Settings className="w-12 h-12 text-indigo-500" style={{animationDuration: '4s'}} />
                    </div> 
                    </div>
                    : carrier.state === 'free' ?  
                      <div className='flex'>
                        <div className='w-44'></div>
                        <div className="bg-white/80 rounded-lg p-4 shadow-md">
                            <Loader className="w-12 h-12 text-slate-500" style={{animationDuration: '4s'}} />
                        </div> 
                      </div>
                   :
                    // <div className="text-right h-full box-border scale-90">
                    //   <div className="text-3xl font-bold text-slate-700 pb-2">คิวที่ {carrier.id === 'A' ? '1' : carrier.id === 'B' ? '6' : carrier.id === 'D' ? '13' : ''}</div>
                    //   <div className="text-lg font-semibold text-slate-500">ทะเบียนหน้า 67-6255</div>
                    //   <div className="text-lg font-semibold text-slate-500">ทะเบียนหลัง 67-6520</div>
                    // </div>
                    <div className="flex items-center gap-4 h-full box-border scale-90 ">
                      <div className="text-4xl font-bold text-slate-700 bg-white px-4 py-4 rounded-lg shadow-md h-24 flex flex-col justify-center items-center w-60">
                        <div>คิวที่ {carrier.id === 'A' ? '1' : carrier.id === 'B' ? '6' : carrier.id === 'D' ? '13' : ''}</div>
                      </div>
                      <div className='text-right w-full '>
                        <div className="text-3xl font-semibold text-slate-600 bg-white px-2 py-1 rounded-md shadow-md">หน้า 67-6255</div>
                        <div className="text-3xl font-semibold text-slate-600 mt-2 bg-white px-2 py-1 rounded-md shadow-md">หลัง 67-6520</div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            ))}
          </div>
          {/* Upcoming Slots */}
          <div className="bg-white rounded-2xl shadow-xl p-2">
            {/* <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-600" />
              คิวถัดไป
            </h2> */}
            
            <div className="grid grid-cols-5 gap-4">
              <div
                className={`p-2 rounded-xl border-2 transition-all duration-300 ${
                  false 
                    ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300' 
                    : 'border-slate-300 bg-slate-100'
                }`}
              >
                <div className="div flex items-center justify-around h-full">
                  <div className={`text-2xl font-bold mb-2 ${true ? 'text-slate-700' : 'text-slate-900'}`}>
                    คิวที่ถัดไป
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
                      <div className="text-slate-600 text-sm font-semibold">ทะเบียนหน้า 67-6255</div>
                      <div className="text-slate-600 text-sm font-semibold">ทะเบียนหลัง 67-6520</div>
                      <div className="border-t border-slate-200 pt-3 mt-3">
                        <div className="text-slate-500 text-sm font-semibold">รอประมาณ 30 นาที</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default CarrierDashboard;