import React, { useState, useEffect } from 'react';
import { Truck, Settings, Clock, MapPin, Gauge, Fuel, Verified, Loader2, Loader } from 'lucide-react';
import { useRouting } from '../../hooks/routing-hook';
import TruckModel from '../../components/truck/truck-model';
import Slider from '@mui/material/Slider';
import QueueManageDialog from '../../components/manage-dialog/dialog';
import ManageDialog from '../../components/confirm-dialog/dialog';
import QueueListDialog from '../../components/queuelist-dialog/dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TextField } from '@mui/material';

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
  const [filterType, setFilterType] = useState('All');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const { navigatePage } = useRouting();
  const [ datePickerMoedl, setDatePickerModel ] = useState('period');
  const [ summaryMode, setSummaryMode ] = useState('load');

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
      mode: 'OPERATING MODE',
      type: 'auto',
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
      queuenumber: 12,
      usage: 1,
      mode: 'OPERATING MODE',
      type: 'manual',
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
    //   usage: 0,
    //   mode: 'OPERATING MODE',
    //   type: 'auto',
    //   product: 'LNG',
    //   abnormal: false,

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
    //   mode: 'OPERATING MODE',
    //   type: 'manual',
    //   product: 'LNG',
    //   abnormal: false,
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
      mode: 'MAINTENANCE MODE',
      type: 'auto',
      product: 'LNG',
      abnormal: false,
    },
    {
      id: 'D',
      status: 'Dry Run',
      weight: 0,
      loading: 0,
      maxLoading: 17221, 
      timeLoading: '',
      state: 'dry-run',
      carrier: 'DRY RUN',
      verified: true,
      frontlicense: '67-9607',
      rearlicense: '53-1217',
      queuenumber: 4,
      usage: 1,
      mode: 'OPERATING MODE',
      type: 'auto',
      product: 'LNG',
      abnormal: false,
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
                      carrier.state === 'maintenance' ? 'red-100' : 
                        carrier.state === 'dry-run' ? 'blue-50' : 
                         carrier.state === 'pending' ? 'indigo-100' : 'slate-50'
            } rounded-2xl px-6 py-4 shadow-lg border border-white/50`}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-3" onClick={() => downLoadBayData(carrier.id)}>
                <div
                  key={carrier.id} 
                  className={`w-16 h-16 bg-gradient-to-r ${ 
                    carrier.state === 'finished' ? 'from-emerald-400 to-emerald-600' : 
                        carrier.state === 'loading' ? 'from-amber-400 to-orange-500' : 
                          carrier.state === 'maintenance' ? 'from-red-400 to-red-600': 
                            carrier.state === 'dry-run' ? 'from-blue-400 to-blue-600' :
                              carrier.state === 'pending' ? 'from-indigo-400 to-indigo-600'  : 'from-slate-400 to-slate-600'
                    } rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-lg`}>
                  {carrier.id}
                </div>
                <div className={`text-xl font-bold ${ 
                    carrier.state === 'finished' ? 'text-emerald-800' : 
                          carrier.state === 'loading' ? 'text-amber-800' : 
                            carrier.state === 'maintenance' ? 'text-red-800' : 
                              carrier.state === 'dry-run' ? 'text-blue-800 ' :
                                carrier.state === 'pending' ? 'text-indigo-800' : 'text-slate-800'
                }`}>BAYLOAD: {carrier.usage}</div>
              </div>
              {
                carrier.state === 'maintenance' ?
                <div className="bg-white/80 rounded-lg p-4 shadow-md mx-10 invisible">
                    <Settings className="w-14 h-14 text-indigo-500 " style={{animationDuration: '4s'}} />
                </div> : carrier.state === 'free' ?  
                <div className="bg-white/80 rounded-lg p-2 shadow-md mx-10 invisible">
                    <Loader className="w-20 h-20 text-slate-500" style={{animationDuration: '4s'}} />
                </div>  :
                <div className="text-center box-border">
                  <div className="text-3xl font-bold text-slate-700 pb-2">คิวที่ {carrier.id === 'A' ? '1' : carrier.id === 'B' ? '2' : carrier.id === 'D' ? '3' : ''}</div>
                  <div className="text-lg font-semibold text-slate-500">ทะเบียนหน้า 67-6255</div>
                  <div className="text-lg font-semibold text-slate-500">ทะเบียนหลัง 67-6520</div>
                </div>
              }
              <div className={`w-1/5 h-full flex flex-col item-center justify-between bg-white/60 backdrop-blur-sm rounded-xl px-4 py-4 shadow-md border border-white/30`}>
                {
                  carrier.loading !== null && carrier.maxLoading !== null && carrier.verified &&  carrier.state != 'maintenance' &&  carrier.state != 'dry-run' ? 
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
                            carrier.state === 'maintenance' ? 'text-red-800' : 
                              carrier.state === 'dry-run' ? 'text-blue-800 ' :
                                carrier.state === 'pending' ? 'text-indigo-800' : 'text-slate-800'
                    }`}>สถานะ: {carrier.status}</div>
                    <div className={`text-lg font-semibold ${ 
                      carrier.state === 'finished' ? 'text-emerald-800' : 
                          carrier.state === 'loading' ? 'text-amber-800' : 
                            carrier.state === 'maintenance' ? 'text-red-800' : 
                              carrier.state === 'dry-run' ? 'text-blue-800 ' :
                                carrier.state === 'pending' ? 'text-indigo-800' : 'text-slate-800'
                    }`}>{carrier.timeLoading}</div>
                  </div>
                </div>
              </div>
              <div className={`w-1/5 min-h-24 h-full relative mr-36`}>
                { carrier.state === 'maintenance' ? 
                  <div className='absolute top-1/2 left-1/3 -translate-y-1/2 flex flex-col items-center justify-center h-auto gap-2 overflow-x-hidden'>
                    <div className="bg-white/80 rounded-lg p-2 shadow-md">
                        <svg className='w-24 h-24' width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.5 77.5L15 94L0 95V124L15 125.5L19.5 143.5L7.5 152.5L21.5 177L36 171L49 184L43 198L67 211.5L77 200.5L94.5 205L95.5 219.5H124.5L126 205L143 200L153.5 212.5L165 205L135.5 176C122.487 181.129 114.731 181.778 100.5 181C87.4298 176.939 80.2716 173.869 68 166.5C58.7644 159.257 54.2153 154.441 47.5 144C40.3204 129.649 38.7715 120.96 40 104.5C41.9083 88.1972 44.7655 79.7368 54.5 66.5C66.5317 51.4697 76.0931 45.7928 97.5 40C123.014 37.9766 134.599 41.5314 152 53.5C168.484 67.1568 174.175 76.5059 179.5 95.5C181.155 112.083 180.077 120.728 175 135.5L205 164L212.5 154L200.5 143L204.5 126L219.5 124.5L219 95.5L204.5 94.5L200 76.5L212.5 66.5L198 42.5L183.5 49.5L170.5 35L177 22L153.5 7.5L143 20.5L125 14L124.5 0H95.5L95 14L76 19L66.5 7L42.5 22L48.5 35L35 48.5L22 42.5L7 67.5L19.5 77.5Z" fill="#FF0000"/>
                          <path d="M103.999 121.999L74.4994 92.4987C70.6324 105.408 70.4094 112.633 72.9994 125.499C78.5881 134.907 82.7779 138.775 91.4994 143.999C104.483 147.285 111.522 147.948 123.499 146.499L190.999 212.499C208.943 212.784 215.544 209.642 212 189.5L211.999 189.499L146.999 124.499C148.577 111.915 148.582 104.623 143.999 92.4987C137.681 81.3072 132.836 76.397 119.999 71.9987C108.695 71.1535 102.701 71.8839 92.4994 74.9987L122.499 103.499V113.999L113.999 122.499L103.999 121.999Z" fill="#FF0000"/>
                        </svg>
                    </div> 
                  </div> : 
                  carrier.state === 'free' ? 
                  <div className='absolute top-1/2 left-1/3 -translate-y-1/2 flex flex-col items-center justify-center h-auto gap-2 overflow-x-hidden'>
                    <div className="bg-white/80 rounded-lg p-2 shadow-md">
                        <Loader className="w-24 h-24 text-slate-500" style={{animationDuration: '4s'}} />
                    </div>
                  </div> : 
                  <div className='w-full absolute top-1/2 left-0 -translate-y-1/2 flex flex-col items-center justify-center h-auto gap-1 overflow-x-hidden bg-white/60 backdrop-blur-sm rounded-xl px-4 py-1 shadow-md border border-white/30'>
                    {carrier.state != 'pending' ? (
                      <div className="animate-truck-enter">
                        <TruckModel key={carrier.id} product={carrier.product}/>
                      </div>
                    ) : carrier.loading >= 2000 ? (
                      <div className="animate-truck-enter">
                        <TruckModel key={carrier.id} product={carrier.product}/>
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
                  ${ carrier.state === 'maintenance' ? 'text-slate-200 bg-red-500 border-white' : 'text-black bg-emerald-400 border-emerald-600' } shadow-black/30 shadow-lg`}>
                  <div>{carrier.mode}</div>
                </div>
                <div onClick={() => {
                    setSelectBayData(carrier);
                    setSelectBtnType('MANAGEMENT');
                    setOpenDataDialog(true);
                  }} className={`w-full h-full grid place-items-center text-base font-bold rounded-md
                  ${ carrier.state === 'xxxxx' ? 'text-slate-200 bg-red-500 border-white' : 'text-slate-200 border-slate-200 bg-black/60' } shadow-black/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                  <div>Management</div>
                </div>
                <div onClick={() => {      
                    setSelectBayData(carrier);            
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
                <div onClick={() => setOpenQueueDialog(true)} className='w-full py-1.5 text-sm text-center font-bold rounded-md text-slate-200 border-slate-200 bg-black/50 shadow-black/30 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>Wait for Queue</div>
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
            <div className="flex flex-col items-center gap-2.5 justify-between h-full">
              <div className='w-full text-2xl text-center font-bold text-slate-600'>Bay Usage: {bayData.reduce((acc, cur) => { return acc += cur.usage }, 0)}</div>
              <div className='w-full flex flex-col gap-3 cursor-pointer'>
                <div className='gap-2 flex'>
                  {
                    datePickerMoedl === 'period' ? 
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Start"
                        value={startDate}
                        onChange={setStartDate}
                        slotProps={{
                          textField: {
                            size: 'small',
                            sx: {
                              '& .MuiPickersInputBase-root': {
                                padding: '0px 8px',
                                fontSize: '0.75rem',
                                height: '28px',
                                overflow: 'hidden',
                                fontWeight: 'bold',
                                backgroundColor: 'whitesmoke'
                              }
                            }
                          }
                        }}
                      />
                      <DatePicker
                        label="End"
                        value={endDate}
                        onChange={setEndDate}
                        slotProps={{
                          textField: {
                            size: 'small',
                            sx: {
                              '& .MuiPickersInputBase-root': {
                                padding: '0px 8px',
                                fontSize: '0.75rem',
                                height: '28px',
                                overflow: 'hidden',
                                fontWeight: 'bold',
                                backgroundColor: 'whitesmoke'
                              }
                            }
                          }
                        }}
                      />
                    </LocalizationProvider> : 
                    datePickerMoedl === 'year' ? 
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Year"
                        views={['year']}
                        value={startDate}
                        onChange={setStartDate}
                        slotProps={{
                          textField: {
                            size: 'small',
                            fullWidth: true,
                            sx: {
                              '& .MuiPickersInputBase-root': {
                                padding: '0px 8px',
                                fontSize: '0.75rem',
                                height: '28px',
                                overflow: 'hidden',
                                fontWeight: 'bold',
                                backgroundColor: 'whitesmoke'
                              }
                            }
                          }
                        }}
                      />
                    </LocalizationProvider> : null
                  }
                </div>
                <div className='gap-2 flex'>
                  <button 
                    onClick={() => { setSummaryMode('load')}}
                    className={`w-full py-1.5 px-1 text-xs text-center font-bold rounded-sm text-slate-200 border-slate-200 shadow-black/30 shadow-md ${summaryMode === 'load' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-black/50 hover:bg-black/60'}`}
                  >Load</button>
                  <button 
                    onClick={() => { setSummaryMode('dryrun')}}
                    className={`w-full py-1.5 px-1 text-xs text-center font-bold rounded-sm text-slate-200 border-slate-200 shadow-black/30 shadow-md ${summaryMode === 'dryrun' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-black/50 hover:bg-black/60'}`}
                  >DryRun</button>
                  <button 
                    onClick={() => { setDatePickerModel('period')}}
                    className={`w-full py-1.5 px-1 text-xs text-center font-bold rounded-sm text-slate-200 border-slate-200 shadow-black/30 shadow-md ${datePickerMoedl === 'period' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-black/50 hover:bg-black/60'}`}
                  >Period</button>
                  <button 
                    onClick={() => { setDatePickerModel('year')}}
                    className={`w-full py-1.5 px-1 text-xs text-center font-bold rounded-sm text-slate-200 border-slate-200 shadow-black/30 shadow-md ${datePickerMoedl === 'year' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-black/50 hover:bg-black/60'}`}
                  >Year</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <QueueListDialog open={openQueueDialog} mode={'cancle'} onClose={() => {setOpenQueueDialog(false)}}></QueueListDialog>
        <ManageDialog opens={openModeDialog}  selectedAction={selectedMode} count={0} onSave={(st) => {
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