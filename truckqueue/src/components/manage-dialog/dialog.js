import React, { useEffect, useState } from 'react';
import { cancleQueueAtBay, cancleQueueToRegister, finishQueueDataAtBay, getDatabyOrder, getDatabyPlateNumber, setAutoModeToBay, setBaySettingData, setDryRunModeToBay, setManualModeToBay } from '../../services/http-service';
import bayImg from '../../assets/bay.png';
import TruckModel from '../truck/truck-model';
import Slider from '@mui/material/Slider';
import { Search, Settings } from 'lucide-react';
import ManageDialog from '../confirm-dialog/dialog';
import { InputAdornment, TextField } from '@mui/material';
import QueueListDialog from '../queuelist-dialog/dialog';
import AlertDialog from '../alert-dialog/dialog';

const QueueManageDialog = ({ open, data, type, onSave, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [operatingMode, setOperatingMode] = useState('OPERATING MODE');
  const [autoQueuing, setAutoQueuing] = useState(true);
  const [openDataDialog, setOpenDataDialog] = useState(false);
  const [openQueueDialog, setOpenQueueDialog] = useState(false);
  const [selectedAction2, setSelectedAction2] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedMode, setSelectedMode] = useState(false);
  const [countAction, setcountAction] = useState(0);
  const [delayTime, setDelayTime] = useState(0);
  const [startWeigth, setStartWeigth] = useState(0);
  const [existWeigth, setExistWeigth] = useState(0);
  const [bayData, setBayData] = useState(null);
  const [messageAlert, setMessageAlert] = useState('');
  const [openAlert2, setOpenAlert2] = useState(false);

  useEffect(() => {
    //console.log(data)
  }, [open]);

  useEffect(() => {
    setDelayTime(data?.autodelay??0);
    setStartWeigth(data?.startweight??0);
    setExistWeigth(data?.existweight??0);
  }, [data]);

  const handleClose = () => {
    setSelectedAction('');
    setSelectedAction2('');
    setSelectedMode(false);
    setOpenDataDialog(false);
    setOpenQueueDialog(false);
    onClose();
  }

  const handleSave = async (cfmStatus) => {
    setOpenDataDialog(false);
    setOpenQueueDialog(false);

    switch (selectedAction) {
      case 'Enable Dry Run Mode':
        if (cfmStatus) {
          handleDryRunMode(true);
        }
        break;
      case 'Disable Dry Run Mode':
        if (cfmStatus) {
          handleDryRunMode(false);
        }
        break;
      case 'Finish Dry Run':
      case 'Finish Queue':
        if (cfmStatus) {
          handleFinishQueue();
        }
        break;
      case 'Cancel to Queuing':
        if (cfmStatus) {
          handleCancleToQueue();
        }
        break;
      case 'Cancel to Register':
        if (cfmStatus) {
          handleCancleToRegister();
        }
        break;
      case 'Auto Queuing':
        if (cfmStatus) {
          handleAutoQueue();
        }
        break;
      case 'Manual Queuing':
        if (cfmStatus) {
          handleManualQueue();
        }
        break;
      default:
        break;
    }

    //setSelectedAction('');
  };

  const handleAutoQueue = async () => {
    const result = await setAutoModeToBay(data.id);
    if(result && result.Message){
      //alert(result.Message);
      setMessageAlert(result.Message);
      setOpenAlert2(true);
    } else {
      setMessageAlert('No response from server.');
      setOpenAlert2(true);
    }
    //handleClose();
  };

  const handleManualQueue = async () => {
    const result = await setManualModeToBay(data.id);
    if(result && result.Message){
      //alert(result.Message);
      setMessageAlert(result.Message);
      setOpenAlert2(true);
    } else {
      setMessageAlert('No response from server.');
      setOpenAlert2(true);
    }
    //handleClose();
  };

  const handleFinishQueue = async () => {
    const result = await finishQueueDataAtBay(data.id);
    if(result && result.Message){
      //alert(result.Message);
      setMessageAlert(result.Message);
      setOpenAlert2(true);
    } else {
      setMessageAlert('No response from server.');
      setOpenAlert2(true);
    }
    //handleClose();
  };

  const handleCancleToQueue = async () => {
    const result = await cancleQueueAtBay(data.id);
    if(result && result.Message){
      //alert(result.Message);
      setMessageAlert(result.Message);
      setOpenAlert2(true);
    } else {
      setMessageAlert('No response from server.');
      setOpenAlert2(true);
    }
    //handleClose();
  };

  const handleCancleToRegister = async () => {
    const result = await cancleQueueToRegister(data.id);
    if(result && result.Message){
      //alert(result.Message);
      setMessageAlert(result.Message);
      setOpenAlert2(true);
    } else {
      setMessageAlert('No response from server.');
      setOpenAlert2(true);
    }
    //handleClose();
  };

  const handleDryRunMode = async (st) => {
    const result = await setDryRunModeToBay(data.id, st);
    if(result && result.Message){
      //alert(result.Message);
      setMessageAlert(result.Message);
      setOpenAlert2(true);
    } else {
      setMessageAlert('No response from server.');
      setOpenAlert2(true);
    }
    //handleClose();
  };

  const handleSettingBayData = async () => {
    const delay = delayTime;
    const stWeigth = startWeigth;
    const enWeigth = existWeigth;
    const result = await setBaySettingData(data.id, delay, stWeigth, enWeigth);
    if(result && result.Message){
      //alert(result.Message);
      setMessageAlert(result.Message);
      setOpenAlert2(true);
    } else {
      setMessageAlert('No response from server.');
      setOpenAlert2(true);
    }
    //handleClose();
  };

  const checkBayStatus = () => {
    if(data.state == 'free' || data.state == 'maintenance'){
      return true;
    } else if(data.state == 'pending' && data.weight >= data.startweight){
      return false;
    } else if(data.weight >= data.startweight){
      return false;
    } else {
      return true;
    }
  }
  

  if (!open) {
    return (
      <div></div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-screen-lg mx-auto">
        {/* Header */}
        <div className={`bg-gradient-to-l ${data.state === 'finished' ? 'from-emerald-400 to-emerald-600' :
            data.state === 'loading' ? 'from-amber-400 to-orange-500' :
              data.state === 'maintenance' ? 'from-red-400 to-red-600' :
                data.state === 'pending' ? 'from-indigo-400 to-indigo-600' :
                  data.state === 'dry-run' ? 'from-blue-400 to-blue-600' : 'from-slate-400 to-slate-600'
          } text-white text-2xl font-bold px-6 py-4 rounded-t-xl`}>
          Queue {type.toLowerCase()} at BAY {data.id}
        </div>
        {/* Content */}
        <div className="p-8">
          <div className='w-full h-full grid grid-cols-12 gap-4'>
            {/* Left Content */}
            <div className='w-full col-span-7 row-span-7'>
              <div className="w-full h-full flex flex-col items-center bg-gray-100 rounded-md px-4 py-4">
                <h4 className="w-full text-left text-lg font-bold text-gray-700 mb-3">Queuing Infomation at BAY {data.id}</h4>
                <div className="w-full h-full grid grid-cols-1 content-end">
                  {
                    data.state == 'free' || data.state == 'maintenance' ? null :
                      <div className="w-full grid grid-cols-12 gap-x-4 mb-10 text-center box-border">
                        <div className="col-span-6 row-span-6 text-3xl font-bold text-slate-700 flex items-center justify-center">
                          <div>คิวที่ {data.queuenumber}</div>
                        </div>
                        <div className="col-span-6 row-span-3 text-lg text-left font-semibold text-slate-500">ทะเบียนหน้า {data.frontlicense??'---'}</div>
                        <div className="col-span-6 row-span-3 text-lg text-left font-semibold text-slate-500">ทะเบียนหลัง {data.rearlicense??'---'}</div>
                      </div>
                  }
                  <div className={`w-full flex flex-col item-center justify-between mb-6 px-20`}>
                    {
                      data.state == 'free' || data.state == 'maintenance' || data.state == 'dry-run' ? null :
                        data.loading !== null && data.maxLoading !== null && data.verified ?
                          <div className=''>
                            <Slider
                              sx={{
                                height: 24,
                                color: 'transparent',
                                '& .MuiSlider-track': {
                                  height: 24,
                                  borderRadius: 4,
                                  backgroundImage: `linear-gradient(to right, ${data.state === 'finished' ? '#34d399' :
                                      data.state === 'loading' ? '#fbbf24' : '#e0e0e0'}, ${data.state === 'finished' ? '#059669' :
                                      data.state === 'loading' ? '#f97316' : '#e0e0e0'
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
                                  border: `4px solid ${data.state === 'finished' ? '#059669' :
                                      data.state === 'loading' ? '#f97316' : '#e0e0e0'
                                    }`,
                                  boxShadow: '0px 2px 2px rgba(0,0,0,0.2)',
                                },
                                '& .MuiSlider-valueLabel': {
                                  backgroundColor: `${data.state === 'finished' ? '#059669' :
                                      data.state === 'loading' ? '#f97316' : '#e0e0e0'
                                    }`,
                                  color: '#fff',
                                  borderRadius: '8px',
                                  fontWeight: 'bold',
                                  fontSize: 16,
                                  padding: '4px 8px',
                                  top: -18,
                                  // '&:before': {
                                  //   display: 'none', // เอาลูกศรออก
                                  // },
                                  transform: 'translateY(-50%) scale(1) !important',
                                },
                              }}
                              aria-label="Always visible"
                              defaultValue={0}
                              value={data.loading}
                              min={0}
                              max={data.maxLoading + (data.maxLoading * 0.05)}
                              getAriaValueText={(value) => `${data.loading} / ${data.maxLoading} kg.`}
                              valueLabelFormat={(value) => `${data.loading} / ${data.maxLoading} kg.`}
                              step={10}
                              valueLabelDisplay="on"
                            />
                          </div> : null
                    }
                    {
                      data.state === 'maintenance' ?
                        <div className='w-full flex justify-center mb-5'>
                          <div className="bg-white/80 rounded-lg p-4 shadow-md mx-10">
                            <svg className='w-40 h-40' width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19.5 77.5L15 94L0 95V124L15 125.5L19.5 143.5L7.5 152.5L21.5 177L36 171L49 184L43 198L67 211.5L77 200.5L94.5 205L95.5 219.5H124.5L126 205L143 200L153.5 212.5L165 205L135.5 176C122.487 181.129 114.731 181.778 100.5 181C87.4298 176.939 80.2716 173.869 68 166.5C58.7644 159.257 54.2153 154.441 47.5 144C40.3204 129.649 38.7715 120.96 40 104.5C41.9083 88.1972 44.7655 79.7368 54.5 66.5C66.5317 51.4697 76.0931 45.7928 97.5 40C123.014 37.9766 134.599 41.5314 152 53.5C168.484 67.1568 174.175 76.5059 179.5 95.5C181.155 112.083 180.077 120.728 175 135.5L205 164L212.5 154L200.5 143L204.5 126L219.5 124.5L219 95.5L204.5 94.5L200 76.5L212.5 66.5L198 42.5L183.5 49.5L170.5 35L177 22L153.5 7.5L143 20.5L125 14L124.5 0H95.5L95 14L76 19L66.5 7L42.5 22L48.5 35L35 48.5L22 42.5L7 67.5L19.5 77.5Z" fill="#FF0000" />
                              <path d="M103.999 121.999L74.4994 92.4987C70.6324 105.408 70.4094 112.633 72.9994 125.499C78.5881 134.907 82.7779 138.775 91.4994 143.999C104.483 147.285 111.522 147.948 123.499 146.499L190.999 212.499C208.943 212.784 215.544 209.642 212 189.5L211.999 189.499L146.999 124.499C148.577 111.915 148.582 104.623 143.999 92.4987C137.681 81.3072 132.836 76.397 119.999 71.9987C108.695 71.1535 102.701 71.8839 92.4994 74.9987L122.499 103.499V113.999L113.999 122.499L103.999 121.999Z" fill="#FF0000" />
                            </svg>
                          </div>
                        </div> : null
                    }
                    {
                      data.state == 'free' || data.state == 'maintenance' || data.state == 'dry-run' || data.state == 'pending' ?
                        <div className="w-full bg-white/60 backdrop-blur-sm rounded-xl px-4 py-4 shadow-md border border-white/30">
                          <div className='flex items-center justify-center'>
                            <div className={`text-2xl font-bold ${data.state === 'finished' ? 'text-emerald-800' :
                                data.state === 'loading' ? 'text-amber-800' :
                                  data.state === 'maintenance' ? 'text-red-800' :
                                    data.state === 'dry-run' ? 'text-blue-800' : 'text-slate-800'
                              }`}>สถานะ: {data.status}</div>
                          </div>
                        </div> :
                        <div className="">
                          <div className='flex items-center justify-between'>
                            <div className={`text-lg font-semibold ${data.state === 'finished' ? 'text-emerald-800' :
                                data.state === 'loading' ? 'text-amber-800' :
                                  data.state === 'maintenance' ? 'text-red-800' :
                                    data.state === 'dry-run' ? 'text-blue-800' : 'text-slate-800'
                              }`}>สถานะ: {data.status}</div>
                            <div className={`text-lg font-semibold ${data.state === 'finished' ? 'text-emerald-800' :
                                data.state === 'loading' ? 'text-amber-800' :
                                  data.state === 'maintenance' ? 'text-red-800' :
                                    data.state === 'dry-run' ? 'text-blue-800' : 'text-slate-800'
                              }`}>{data.timeLoading}</div>
                          </div>
                        </div>
                    }
                  </div>
                  <div className={`w-full flex flex-col items-center justify-center h-auto gap-2 overflow-x-hidden ${
                    checkBayStatus() ? 'invisible' : 'visible'
                  } `}>
                    <div className="animate-truck-enter">
                      <TruckModel />
                    </div>
                  </div>
                  <div className='w-full h-7'>
                    <img alt='logo' src={bayImg} className='w-full' />
                  </div>
                </div>
              </div>
            </div>
            {/* Rigth Top Content */}
            <div className='w-full col-span-5 row-span-3 '>
              <div className="bg-gray-100 rounded-md px-4 py-4">
                <h4 className="text-lg font-bold text-gray-700 mb-3">Queuing Status</h4>
                <div className="space-y-4">
                  <button className={`w-full ${data.state === 'maintenance' ? 'bg-red-500' : 'bg-green-500'} text-white py-2 px-4 rounded-md text-lg font-medium`}>
                    {data.state === 'maintenance' ? 'MAINTENANCE MODE' : 'OPERATING MODE'}
                    <div className="text-xs opacity-80">Signal From DCS</div>
                  </button>
                  {
                    type == 'SETTING' ? null :
                      <div className="flex space-x-4">
                        <button
                          disabled={data.state === 'maintenance' ? true : false}
                          className={`flex-1 py-2 px-3 text-md font-semibold rounded border-2 border-x-zinc-400 shadow-sm shadow-black bg-gradient-to-b ${
                            data.type == 'auto' ? 'from-blue-400 to-blue-800 text-white' : 'from-gray-100 to-gray-400 text-gray-800'
                          }`}
                          onClick={() => {
                            setOpenDataDialog(true);
                            setcountAction(0);
                            setSelectedAction('Auto Queuing');
                            setSelectedAction2('Auto Queuing');
                          }}
                        >
                          Auto Queuing
                        </button>
                        <button
                          disabled={data.state === 'maintenance' ? true : false}
                          className={`flex-1 py-2 px-3 text-md font-semibold rounded border-2 border-x-zinc-400 shadow-sm shadow-black bg-gradient-to-b ${
                            data.type == 'manual' ? 'from-blue-400 to-blue-800 text-white' : 'from-gray-100 to-gray-400 text-gray-800'
                          }`}
                          onClick={() => {
                            setOpenDataDialog(true);
                            setcountAction(0);
                            setSelectedAction('Manual Queuing')
                            setSelectedAction2('Manual Queuing')
                          }
                          }
                        >
                          Manual Queuing
                        </button>
                      </div>
                  }
                </div>
              </div>
            </div>
            {/* Rigth Bottom Content */}
            {
              type == 'SETTING' ?
                <div className='w-full col-span-5 row-span-4'>
                  <div className="bg-gray-100 rounded-lg px-4 py-4 h-full">
                    <h4 className="text-lg font-bold text-gray-700 mb-3">Queuing {type == 'SETTING' ? 'Setting' : 'Management'}</h4>
                    <div className="grid grid-cols-1 gap-4 mb-3">
                      <TextField disabled={data.state !== 'free' ? true : false} label="Auto Assign Delay (S)" size="small" type='number' value={delayTime} onChange={(e) => {
                        if(e.target.value<0){
                          //setDelayTime(0);
                        } else {
                          setDelayTime(e.target.value);
                        }
                      }} />
                      <TextField disabled={data.state !== 'free' ? true : false} label="Starting Weight (T)" size="small" type='number' value={startWeigth} onChange={(e) => {
                        if(e.target.value<0){
                          //setStartWeigth(0);
                        } else {
                          setStartWeigth(e.target.value);
                        }
                      }} />
                      <TextField disabled={data.state !== 'free' ? true : false} label="Exit Weight (T)" size="small" type='number' value={existWeigth} onChange={(e) => {
                        if(e.target.value<0){
                          //setExistWeigth(0);
                        } else {
                          setExistWeigth(e.target.value);
                        }
                      }} />
                      <span className='font-semibold'>Last Update 1: {data?.lastchange1??'---'}</span>
                      <span className='font-semibold'>Last Update 2: {data?.lastchange2??'---'}</span>
                    </div>
                  </div>
                </div>
                :
                <div className='w-full col-span-5 row-span-4 '>
                  <div className="bg-gray-100 rounded-lg px-4 py-4">
                    <h4 className="text-lg font-bold text-gray-700 mb-3">Queuing {type == 'SETTING' ? 'Setting' : 'Management'}</h4>
                    {/* <button 
                      disabled={data.state === 'maintenance' ? true : false}
                      className={`w-full mb-3 flex-1 py-1.5 px-3 text-md font-semibold rounded border-2 border-x-zinc-400 shadow-sm shadow-black bg-gradient-to-b ${ data.isdryrun ? 'from-blue-400 to-blue-800 text-white' : 'from-gray-100 to-gray-400 text-gray-800' }`}
                      onClick={() => {
                        setSelectedMode(!selectedMode)
                        setOpenDataDialog(true);
                        setcountAction(0)
                        setSelectedAction( !data?.isdryrun ? 'Enable Dry Run Mode' : 'Disable Dry Run Mode')
                      }
                      }
                    >
                      Dry Run Mode
                    </button> */}
                    <div className="grid grid-cols-2 gap-6 mb-3">
                      <button
                        disabled={data.state === 'maintenance' || data.state === 'free' ? true : false}
                        className={`w-full flex-1 py-1.5 px-3 text-md font-semibold rounded border-2 border-x-zinc-400 shadow-sm shadow-black bg-gradient-to-b from-gray-100 to-gray-400 text-gray-800
                           hover:from-gray-100 hover:to-gray-400 hover:text-gray-800 hover:border-x-zinc-400 hover:shadow-sm hover:translate-y-0 hover:scale-100
                            transition-all duration-300 ease-out
                            cursor-pointer disabled:cursor-not-allowed`}
                        onClick={() => {
                          setOpenDataDialog(true);
                          setcountAction(0)
                          setSelectedAction(data.isdryrun ? 'Finish Dry Run' : 'Finish Queue')
                        }
                        }
                      >
                        {data.isdryrun ? 'Finish Dry Run' : 'Finish Queue'}
                      </button>
                      <button
                        disabled={ data.state === 'free' && !data.isauto ? false : true}
                        className={`w-full flex-1 py-1.5 px-3 text-md font-semibold rounded border-2 border-x-zinc-400 shadow-sm shadow-black bg-gradient-to-b from-gray-100 to-gray-400 text-gray-800
                           hover:from-gray-100 hover:to-gray-400 hover:text-gray-800 hover:border-x-zinc-400 hover:shadow-sm hover:translate-y-0 hover:scale-100
                            transition-all duration-300 ease-out
                            cursor-pointer disabled:cursor-not-allowed`}
                        onClick={() => {
                          setOpenQueueDialog(true);
                          setcountAction(0)
                          setSelectedAction('Assign Queue')
                        }
                        }
                      >
                        Assign Queue
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-3">
                      <button 
                        disabled={data.state === 'maintenance' || data.state === 'free' ? true : false}
                        className={`w-full flex-1 py-1.5 px-3 text-md font-semibold rounded border-2 border-x-zinc-400 shadow-sm shadow-black bg-gradient-to-b from-gray-100 to-gray-400 text-gray-800
                          hover:from-gray-100 hover:to-gray-400 hover:text-gray-800 hover:border-x-zinc-400 hover:shadow-sm hover:translate-y-0 hover:scale-100
                          transition-all duration-300 ease-out
                          cursor-pointer disabled:cursor-not-allowed`}
                        onClick={() => {
                          setOpenDataDialog(true);
                          setcountAction(10)
                          setSelectedAction('Cancel to Queuing')
                        }}
                      >
                        Cancel to Queuing
                      </button>
                      <button 
                        disabled={data.state === 'maintenance' || data.state === 'free' ? true : false}
                        className={`w-full flex-1 py-1.5 px-3 text-md font-semibold rounded border-2 border-x-zinc-400 shadow-sm shadow-black bg-gradient-to-b from-gray-100 to-gray-400 text-gray-800
                          hover:from-gray-100 hover:to-gray-400 hover:text-gray-800 hover:border-x-zinc-400 hover:shadow-sm hover:translate-y-0 hover:scale-100
                          transition-all duration-300 ease-out
                          cursor-pointer disabled:cursor-not-allowed`}
                        onClick={() => {
                          setOpenDataDialog(true);
                          setcountAction(10)
                          setSelectedAction('Cancel to Register')
                        }
                        }
                      >
                        Cancel to Register
                      </button>
                    </div>
                  </div>
                </div>
            }
          </div>
        </div>
        {/* Footer */}
        <div className="p-6 bg-gray-100 rounded-b-xl flex justify-between space-x-4">
          <button onClick={handleClose} className="px-8 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2">
            <span>⏮</span>
            <span>ย้อนกลับ</span>
          </button>
          {
            type != 'SETTING' ? null :
              <button onClick={handleSettingBayData} className="px-8 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2">
                <span>✓</span>
                <span>ยืนยัน</span>
              </button>
          }
        </div>
        <ManageDialog opens={openDataDialog} selectedAction={selectedAction} count={countAction} onSave={(st) => {
          setcountAction(0);
          handleSave(st);
        }}></ManageDialog>
        <AlertDialog opens={openAlert2} message={messageAlert} onSave={() => {
          setOpenAlert2(false);
          setMessageAlert('');
          handleClose();
        }} />
        <QueueListDialog open={openQueueDialog} data={data} mode={'assign'} bay={data.id} onClose={handleClose}></QueueListDialog>
      </div>
    </div>
  );
};

export default QueueManageDialog;

