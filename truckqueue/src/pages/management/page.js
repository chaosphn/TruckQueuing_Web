import React, { useState, useEffect, useContext, use } from 'react';
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
import { QueueContext } from '../../utils/AppContext';
import { getPeriodQueueData, getTotalQueueData, setTASMode } from '../../services/http-service';
import { dateFormatParser } from '../../services/date-service';
import { set } from 'date-fns';
import logoImg from '../../assets/logo.png';
import AlertDialog from '../../components/alert-dialog/dialog';

const CarrierManagement = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [ bayDatas, setBayData ] = useState([]);
  const [ queueData, setQueueData ] = useState([]);
  const [ selectBayData, setSelectBayData ] = useState(null);
  const [ selectBtnType, setSelectBtnType ] = useState('');
  const [ openDataDialog, setOpenDataDialog ] = useState(false);
  const [ openQueueDialog, setOpenQueueDialog ] = useState(false);
  const [ openModeDialog, setOpenModeDialog ] = useState(false);
  const [selectedMode, setSelectedMode] = useState('');
  const [statusMode, setStatusMode] = useState(true);
  const [selectedAction, setSelectedAction] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const { navigatePage } = useRouting();
  const [ datePickerMoedl, setDatePickerModel ] = useState('period');
  const [ summaryMode, setSummaryMode ] = useState('load');
  const [ totalQueue, setTotalQueue ] = useState(0);
  const [ totalBay, setTotalbay ] = useState(0);
  const [messageAlert, setMessageAlert] = useState('');
  const [openAlert2, setOpenAlert2] = useState(false);
  const { queue, updateQueueData, bayData, waitingQueue, updateBayData, tasStatus, updateTASStatus, apiStatus, updateApiStatus } = useContext(QueueContext);
  const minDate = new Date().setFullYear(2012, 0, 1);
  
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    //console.log('Updating bay data');
    const bayList = carriers.slice(0, 4);
    const data = bayList.map((item) => {
      const findBayData = bayData.find(x => x.METER_NAME == item.id);
      if(findBayData){
        return {
          id: item.id,
          status: 
            findBayData.STATUS == 'CALLING' && findBayData.MAINTENANCE == 'n' ? 'เรียกคิว' : 
            findBayData.STATUS == 'READY'&& findBayData.MAINTENANCE == 'n' ? 'พร้อมโหลด' : 
            findBayData.STATUS == 'DRYRUN'&& findBayData.MAINTENANCE == 'n' && findBayData.DRYRUN == 'y' ? 'Dry Run' : 
            findBayData.STATUS == 'LOADING'&& findBayData.MAINTENANCE == 'n' ? 'กำลังโหลด' : 
            findBayData.STATUS == 'LOADED'&& findBayData.MAINTENANCE == 'n' ? 'โหลดเสร็จสิ้น' : 
            findBayData.STATUS == 'EMPTY'&& findBayData.MAINTENANCE == 'n' ? 'ว่าง' : 'อยู่ระหว่างซ่อมบำรุง',
          weight: findBayData.CURRENT_WEIGHT,
          loading: findBayData.CURRENT_QNTY,
          maxLoading: findBayData.FINISH_QNTY, 
          timeLoading: findBayData?.CURRENT_TIME !== null ? `${findBayData.CURRENT_TIME}/${findBayData.FINISH_TIME} นาที` : '',
          state: 
            findBayData.STATUS == 'CALLING' && findBayData.MAINTENANCE == 'n' ? 'pending' : 
            findBayData.STATUS == 'READY' && findBayData.MAINTENANCE == 'n' ? 'pending' : 
            findBayData.STATUS == 'DRYRUN' && findBayData.MAINTENANCE == 'n' && findBayData.DRYRUN == 'y' ? 'dry-run' : 
            findBayData.STATUS == 'LOADING' && findBayData.MAINTENANCE == 'n' ? 'loading' : 
            findBayData.STATUS == 'LOADED' && findBayData.MAINTENANCE == 'n' ? 'finished' : 
            findBayData.STATUS == 'EMPTY' && findBayData.MAINTENANCE == 'n' ? 'free' : 'maintenance',
          carrier: findBayData.CARRIER,
          verified: findBayData.STATUS === 'LOADING',
          frontlicense: findBayData.FRONT_LICENSE,
          rearlicense: findBayData.REAR_LICENSE,
          queuenumber: findBayData.Q_NO,
          product: findBayData.PRODUCT,
          abnormal: true,
          maintenance: findBayData.MAINTENANCE === 'y',
          isdryrun: findBayData.DRYRUN === 'y',
          isauto: findBayData.QUEUE_AUTO === 'y',
          memo: findBayData.MEMO,
          cnt: findBayData.CNT,
          lastchange1: findBayData.LAST_CHANGE1 ? findBayData.LAST_CHANGE1 : '---',
          lastchange2: findBayData.LAST_CHANGE2 ? findBayData.LAST_CHANGE2 : '---',
          startweight: findBayData.SET_START_WEIGHT,
          existweight: findBayData.SET_FINISH_WEIGHT,
          autodelay: findBayData.SET_AUTO_DELAY,
          flowrate: findBayData.SET_FLOW_RATE,
          sq_tare: findBayData.SQ_TARE,
          sq_start: findBayData.SQ_START,
          q_date: findBayData.Q_DATE,
          order: findBayData.ORDER_CODE,
          usage: findBayData.CNT,
          mode: findBayData.MAINTENANCE === 'y' ? 'MAINTENANCE MODE' : 'OPERATING MODE',
          type: findBayData.QUEUE_AUTO === 'y' ? 'auto' : 'manual',
        };
      } else {
        return {
          id: item.id,
          status: 'ว่าง',
          weight: 0,
          loading: 0,
          maxLoading: 0, 
          timeLoading: '',
          state: 'free',
          carrier: '',
          verified: false,
          frontlicense: '',
          rearlicense: '',
          queuenumber: 0,
          product: '',
          abnormal: false,
          maintenance: false,
          isdryrun: false,
          isauto: false,
          memo: null,
          cnt: 0,
          lastchange: '---',
          startweight: 0,
          existweight: 0,
          autodelay: 0,
          flowrate: 0,
          sq_tare: 0,
          sq_start: '',
          q_date: '',
          order: '',
          usage: 0,
          mode: 'OPERATING MODE',
          type: 'auto'
        };
      };
    }); 
    setBayData(data);
  }, [bayData]);

  useEffect(() => {
    //console.log(bayData, waitingQueue)
    setQueueData(waitingQueue);
  }, [waitingQueue]);

  useEffect(() => {
    if(tasStatus && tasStatus.OfflineMode !== undefined){
      if(tasStatus.OfflineMode === true){
        setSelectedMode('Offline');
        setStatusMode(true);
      } else if(tasStatus.OfflineMode === false){
        setSelectedMode('Online');
        setStatusMode(false);
      } else {
        setSelectedMode('Unknow');
        setStatusMode(true);
      }
    } else {
      setSelectedMode('Unknow');
      setStatusMode(true);
    }
  }, [tasStatus]);

  const handleSelectMode = async () => {
    const mode = selectedMode === 'Offline' ? 'n' : 'y';
    const res = await setTASMode(mode);
    if(res && res.Message){
      alert(res.Message);
      await updateTASStatus();
      setOpenModeDialog(false);
    } else {
      //alert('เกิดข้อผิดพลาดในการเปลี่ยนโหมด กรุณาลองใหม่อีกครั้ง');
      setOpenModeDialog(false);
      setMessageAlert('เกิดข้อผิดพลาดในการเปลี่ยนโหมด กรุณาลองใหม่อีกครั้ง');
      setOpenAlert2(true);
    }
  };

  const downLoadBayData = (id) => {
  
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
      abnormal: false,
    },
    {
      id: 'C',
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
      queuenumber: 0,
      product: 'LNG',
      abnormal: false,
    },
    {
      id: 'D',
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

  useEffect(() => {
    handleGetTotaQueue();
    const timer = setInterval(() => {
      handleGetTotaQueue();
    }, 360000);
    return () => clearInterval(timer);
  }, []);

  const handleGetTotaQueue = async () => {
    const result = await getTotalQueueData();
    if(result && result?.QueueUsage >= 0){
      setTotalQueue(result.QueueUsage);
    }
  };

  useEffect(() => {
    handleGetTotaBays();
  }, [startDate, endDate, summaryMode, datePickerMoedl]);

  const handleGetTotaBays = async () => {
    if(datePickerMoedl === 'period'){
      const st = startDate.toDate().getTime();
      const en = endDate.toDate().getTime();
      const diff = st - en;
      if(diff <= 0){
        const start = startDate.format('DD-MMM-YYYY');
        const end = endDate.format('DD-MMM-YYYY');
        const mode = summaryMode === "load" ? "n" : "y";
        const result = await getPeriodQueueData(start, end, mode);
        if(result && result?.QueueUsage >= 0){
          setTotalbay(result.QueueUsage);
        }
      } else {
        //alert('กรุณาเลือกวันที่เริ่มต้นให้น้อยกว่าวันที่สิ้นสุด');
        setMessageAlert('กรุณาเลือกวันที่เริ่มต้นให้น้อยกว่าวันที่สิ้นสุด');
        setOpenAlert2(true);
        setStartDate(endDate);
      }
    } else {
      const date = startDate.toDate();
      const st = date.setFullYear(date.getFullYear(), 0, 1);
      const en = date.setFullYear(date.getFullYear(), 11, 31);
      //const en = new Date(date.getFullYear(), 11, 31);
      const start = dateFormatParser(new Date(st), 'dd-MMM-yyyy');
      const end = dateFormatParser(new Date(en), 'dd-MMM-yyyy');
      const mode = summaryMode === "load" ? "n" : "y";
      const result = await getPeriodQueueData(start, end, mode);
      if(result && result?.QueueUsage >= 0){
        setTotalbay(result.QueueUsage);
      }
    }
  };

  const handleUpdateAllData = async () => {
    await handleGetTotaBays();
    await handleGetTotaQueue();
    await updateBayData();
  };
  

  return (
    <div className="max-w-screen mx-auto w-full min-h-screen h-screen overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-4 flex flex-col justify-between">
      {/* Header */}
      <div className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4" onClick={() => navigatePage('/overview')}>
            <div className="bg-white p-3 rounded-xl">
                  <img alt='logo' src={logoImg} width={100} height={100} className=''/>
                </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">PTTLNG Truck Queuing Management</h1>
              <p className="text-xl text-slate-600">ระบบบริหารจัดการคิว</p>
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
        {bayDatas.map((carrier) => (
          <div
            onClick={() => setSelectBayData(carrier)}
            key={carrier.id}
            className={`bg-${ 
               carrier.state === 'finished' ? 'emerald-400' : 
                    carrier.state === 'loading' ? 'emerald-200' : 
                      carrier.state === 'maintenance' ? 'red-600' : 
                        carrier.state === 'dry-run' ? 'blue-100' : 
                         carrier.state === 'pending' ? 'amber-500' : 'slate-50'
            } ${ carrier.status === 'เรียกคิว' ? 'animate-blink-red-orange' : '' } rounded-2xl px-6 py-4 shadow-lg border border-white/50`}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-3" onClick={() => downLoadBayData(carrier.id)}>
                <div
                  key={carrier.id} 
                  className={`w-16 h-16 bg-gradient-to-r ${ 
                    carrier.state === 'finished' ? 'from-emerald-400 to-emerald-600' : 
                        carrier.state === 'loading' ? 'from-emerald-400 to-emerald-600' : 
                          carrier.state === 'maintenance' ? 'from-red-400 to-red-600': 
                            carrier.state === 'dry-run' ? 'from-blue-400 to-blue-600' :
                              carrier.state === 'pending' ? 'from-amber-400 to-amber-600'  : 'from-slate-400 to-slate-600'
                    } rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-lg`}>
                  {carrier.id}
                </div>
                <div className={`text-xl font-bold ${ 
                    carrier.state === 'finished' ? 'text-white' : 
                          carrier.state === 'loading' ? 'text-white' : 
                            carrier.state === 'maintenance' ? 'text-white' : 
                              carrier.state === 'dry-run' ? 'text-black' :
                                carrier.state === 'pending' ? 'text-white' : 'text-slate-800'
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
                  <div className="text-3xl font-bold text-slate-700 pb-2">คิวที่ { carrier.queuenumber }</div>
                  <div className="text-lg font-semibold text-slate-500">ทะเบียนหัว { carrier.frontlicense }</div>
                  <div className="text-lg font-semibold text-slate-500">ทะเบียนหาง { carrier.rearlicense ? carrier.rearlicense : '---' }</div>
                </div>
              }
              <div className={`w-1/5 h-full flex flex-col item-center justify-between bg-white/60 backdrop-blur-sm rounded-xl px-4 py-4 shadow-md border border-white/30`}>
                {
                  carrier.loading >= 0 && carrier.maxLoading >= 0 && carrier.verified &&  carrier.state != 'maintenance' &&  carrier.state != 'dry-run' &&  carrier.state != 'free' &&  carrier.state != 'pending' ? 
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
                      carrier.state === 'finished' ? 'text-emerald-600' : 
                          carrier.state === 'loading' ? 'text-emerald-600' : 
                            carrier.state === 'maintenance' ? 'text-red-600' : 
                              carrier.state === 'dry-run' ? 'text-blue-800 ' :
                                carrier.state === 'pending' ? 'text-amber-600' : 'text-slate-800'
                    }`}>สถานะ: {carrier.status}</div>
                    <div className={`text-lg font-semibold ${ 
                      carrier.state === 'finished' ? 'text-emerald-600' : 
                          carrier.state === 'loading' ? 'text-emerald-600' : 
                            carrier.state === 'maintenance' ? 'text-red-600' : 
                              carrier.state === 'dry-run' ? 'text-blue-800 ' :
                                carrier.state === 'pending' ? 'text-amber-600' : 'text-slate-800'
                    }`}>{
                      carrier.loading >= 0 && carrier.maxLoading >= 0 && carrier.verified &&  carrier.state != 'maintenance' &&  carrier.state != 'dry-run' &&  carrier.state != 'free' &&  carrier.state != 'pending' ? 
                        carrier.timeLoading : ''}
                    </div>
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
                    <div className="bg-white/80 rounded-lg p-2 shadow-md invisible">
                        <Loader className="w-24 h-24 text-slate-500" style={{animationDuration: '4s'}} />
                    </div>
                  </div> : 
                  <div className='w-full absolute top-1/2 left-0 -translate-y-1/2 flex flex-col items-center justify-center h-auto gap-1 overflow-x-hidden bg-white/60 backdrop-blur-sm rounded-xl px-4 py-1 shadow-md border border-white/30'>
                    {carrier.state != 'pending' && carrier.weight >= carrier.startweight ? (
                      <div className={`animate-truck-enter`}>
                        <TruckModel key={carrier.id} product={carrier.product}/>
                      </div>
                    ) : carrier.weight >= carrier.startweight ? (
                      <div className={`animate-truck-enter`}>
                        <TruckModel key={carrier.id} product={carrier.product}/>
                      </div>
                    ) : null}
                    <div className={`font-semibold text-slate-900`}>
                      { carrier.isdryrun ? 'Dry Run' : carrier.carrier }
                    </div>
                  </div>
                }
              </div>
              <div className='w-1/5 min-h-24 h-full grid grid-cols-2 gap-4 cursor-pointer'>
                {/* <div className={`w-full h-full col-span-2 grid place-items-center text-center text-base font-bold rounded-md border-2 
                  ${ carrier.state === 'maintenance' ? 'text-slate-200 bg-red-500 border-white' : 'text-black bg-emerald-400 border-emerald-600' } shadow-black/30 shadow-lg`}>
                  <div>{carrier.mode}</div>
                </div> */}
                <div className={`w-full h-full grid place-items-center text-center text-sm font-bold rounded-md border-2 
                  ${ carrier.state === 'maintenance' ? 'text-slate-200 bg-red-500 border-white' : 'text-black bg-emerald-400 border-emerald-600' } shadow-black/30 shadow-lg`}>
                  <div>{carrier.mode}</div>
                </div>
                <div className={`w-full h-full grid grid-cols-2 gap-2`}>
                  <div className={`w-full h-full grid place-items-center text-center text-sm font-bold rounded-md border-2 shadow-black/30 shadow-lg
                    ${ carrier.type === 'auto' ? 'text-slate-200 bg-blue-500 border-white' : 'text-black bg-amber-400 border-amber-600' }`}>
                    { carrier.type === 'auto' ? 'Auto' : 'Manual' } 
                  </div>
                  <div className={`w-full h-full grid place-items-center text-center text-sm font-bold rounded-md border-2 shadow-black/30 shadow-lg
                    ${ carrier.isdryrun ? 'text-slate-200 bg-blue-500 border-white' : 'text-black bg-emerald-400 border-emerald-600' }`}>
                    { carrier.isdryrun ? 'Dry Run' : 'Normal' }
                  </div>
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
          handleUpdateAllData();
        }}></QueueManageDialog>
      </div>

      {/* Upcoming Slots */}
      <div className="bg-white flex justify-between gap-3 rounded-2xl shadow-xl p-4">
        <div className="grid grid-cols-6 gap-3 w-[90%]">
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
                  //setSelectedMode(!statusMode ? 'Online Mode' : 'Offline Mode');
                  setOpenModeDialog(true)
                }} className={`w-full py-1.5 text-sm text-center font-bold rounded-md  ${ statusMode ? 'text-slate-200 bg-red-500 border-white' : 'text-black bg-emerald-400 border-emerald-600' } 
                  shadow-black/30 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>{ !statusMode ? 'Online' : 'Offline'} Mode</div>
                <div onClick={() => setOpenQueueDialog(true)} className='w-full py-1.5 text-sm text-center font-bold rounded-md text-slate-200 border-slate-200 bg-black/50 shadow-black/30 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>Waiting Queue</div>
              </div>
            </div>
          </div>
          {queueData.map((slot) => (
            <div
              key={slot.Q_ID}
              className={`p-2 rounded-xl border-2 transition-all duration-300 ${
                slot.available 
                  ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300' 
                  : 'border-slate-300 bg-slate-100'
              }`}
            >
              <div className="div flex items-center justify-around h-full">
                <div className={`text-2xl font-bold mb-2 flex flex-col items-center justify-between ${slot.available ? 'text-slate-700' : 'text-slate-900'}`}>
                  <div className='flex flex-col items-center'>
                    <div>คิวที่</div>
                    <div className='text-3xl'>{slot.Q_NO}</div>
                  </div>
                  {slot.DRYRUN && slot.DRYRUN == 'y' && (
                    <div className='w-full text-center text-xs rounded py-0.5 bg-blue-100 border-2 border-blue-600 mt-3'>
                      dry run
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="text-slate-600 text-base font-semibold">ทะเบียนหัว {slot.FRONT_LICENSE}</div>
                  <div className="text-slate-600 text-base font-semibold">ทะเบียนหาง {slot.REAR_LICENSE}</div>
                  <div className="border-t border-slate-200 pt-3 mt-3">
                    <div className="text-slate-500 text-base font-semibold">รอประมาณ {slot.WAIT_TM} นาที</div>
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
              <div className='w-full text-xl text-center font-bold text-slate-600'>Truck entries (period): {totalBay??0}</div>
              <div className='w-full flex flex-col cursor-pointer'>
                <div className='gap-2 flex mb-2'>
                  {
                    datePickerMoedl === 'period' ? 
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        minDate={dayjs(minDate)}
                        label="Start"
                        value={startDate}
                        onChange={(d) => {
                          setStartDate(d);
                        }}
                        slotProps={{
                          textField: {
                            size: 'small',
                            sx: {
                              '& .MuiPickersInputBase-root': {
                                padding: '0px 4px',
                                fontSize: '0.75rem',
                                height: '28px',
                                overflow: 'visible',
                                fontWeight: 'bold',
                                backgroundColor: 'whitesmoke'
                              }
                            }
                          }
                        }}
                      />
                      <DatePicker
                        minDate={dayjs(minDate)}
                        label="End"
                        value={endDate}
                        onChange={(d) => {
                          setEndDate(d);
                        }}
                        slotProps={{
                          textField: {
                            size: 'small',
                            sx: {
                              '& .MuiPickersInputBase-root': {
                                padding: '0px 4px',
                                fontSize: '0.75rem',
                                height: '28px',
                                overflow: 'visible',
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
                        minDate={dayjs(minDate)}
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
                <div className='gap-2 flex items-center'>
                  <button 
                    onClick={() => { setSummaryMode('load')}}
                    className={`w-full py-1.5 px-1 text-xs text-center font-bold rounded-sm text-slate-200 border-slate-200 shadow-black/30 shadow-md ${summaryMode === 'load' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-black/50 hover:bg-black/60'}`}
                  >Load</button>
                  <button 
                    onClick={() => { setSummaryMode('dryrun')}}
                    className={`w-full py-1.5 px-1 text-xs text-center font-bold rounded-sm text-slate-200 border-slate-200 shadow-black/30 shadow-md ${summaryMode === 'dryrun' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-black/50 hover:bg-black/60'}`}
                  >DryRun</button>
                  <div className='font-bold text-lg text-slate-600'>|</div>
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
        <div
          className={`p-2 rounded-xl border-2 transition-all duration-300 w-[10%] ${
            false 
              ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300' 
              : 'border-slate-300 bg-slate-100'
          }`}
        >
          <div className="div flex flex-col items-center justify-around h-full">
            <div className={`text-2xl font-bold ${true ? 'text-slate-700' : 'text-slate-900'}`}>
              Truck entries (Accumulate)
            </div>
            <div className={`text-3xl font-bold mb-2 ${true ? 'text-slate-700' : 'text-slate-900'}`}>
              {totalQueue??0}
            </div>
          </div>
        </div>
        <AlertDialog opens={openAlert2} message={messageAlert} onSave={() => {
          setOpenAlert2(false);
          setMessageAlert('');
        }} />
        <QueueListDialog open={openQueueDialog} data={selectBayData} mode={'cancle'} onClose={() => {setOpenQueueDialog(false)}}></QueueListDialog>
        <ManageDialog opens={openModeDialog}  selectedAction={
          selectedMode === 'Online' ? 'เปลี่ยนเป็น Offline Mode' : 
            selectedMode === 'Offline' ? 'เปลี่ยนเป็น Online Mode' : 
              'สถานะไม่ชัดเจน'
          } count={0} onSave={(st) => {
            setOpenModeDialog(false);
            if(st){
              handleSelectMode();
            }
        }}></ManageDialog>
      </div>

      <div className="bg-white mx-auto px-8 py-4 w-full rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <div className="text-slate-800 text-base drop-shadow">
            © 2025 PTTLNG Truck Queuing System
          </div>
          <div className="flex items-center space-x-4 text-slate-800 text-base drop-shadow">
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
              <span> Cannot connect to TAS Server database</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default CarrierManagement;