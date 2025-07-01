import React, { useState } from 'react';
import { getDatabyOrder, getDatabyPlateNumber } from '../../services/http-service';
import bayImg from '../../assets/bay.png';
import TruckModel from '../truck/truck-model';
import Slider from '@mui/material/Slider';
import { Settings } from 'lucide-react';
import ManageDialog from '../confirm-dialog/dialog';

const QueueManageDialog = ({ open, data, type, onSave, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [operatingMode, setOperatingMode] = useState('OPERATING MODE');
  const [autoQueuing, setAutoQueuing] = useState(true);
  const [ openDataDialog, setOpenDataDialog ] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [countAction, setcountAction] = useState(0);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);
  const handleSave = async (cfmStatus) => {
    setOpenDataDialog(false);
    if(cfmStatus){

    } else {
      setSelectedAction('');
    }
  };

  if (!open) {
    return (
      <div></div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-screen-lg mx-auto">
        {/* Header */}
        <div className={`bg-gradient-to-l ${ 
          data.state === 'finished' ? 'from-emerald-400 to-emerald-600' : 
            data.state === 'loading' ? 'from-amber-400 to-orange-500' : 
              data.state === 'maintenance' ? 'from-red-400 to-red-600' : 
                data.state === 'dry-run' ? 'from-blue-400 to-blue-600' : 'from-slate-400 to-slate-600'
          } text-white text-2xl font-bold px-6 py-4 rounded-t-xl`}>
          Queue management At BAY { data.id }
        </div>
        {/* Content */}
        <div className="p-8">
          <div className='w-full h-full grid grid-cols-12 gap-4'>
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
                      <div className="col-span-6 row-span-3 text-lg text-left font-semibold text-slate-500">ทะเบียนหน้า 67-6255</div>
                      <div className="col-span-6 row-span-3 text-lg text-left font-semibold text-slate-500">ทะเบียนหลัง 67-6520</div>
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
                              backgroundImage: `linear-gradient(to right, ${
                                data.state === 'finished' ? '#34d399' : 
                                  data.state === 'loading' ? '#fbbf24' : '#e0e0e0'}, ${
                                        data.state === 'finished' ? '#059669' : 
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
                              border: `4px solid ${
                                data.state === 'finished' ? '#059669' : 
                                data.state === 'loading' ? '#f97316' : '#e0e0e0'
                              }`,
                              boxShadow: '0px 2px 2px rgba(0,0,0,0.2)',
                            },
                            '& .MuiSlider-valueLabel': {
                              backgroundColor: `${
                                data.state === 'finished' ? '#059669' : 
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
                          max={data.maxLoading+(data.maxLoading*0.05)}
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
                          <Settings className="w-14 h-14 text-red-500 animate-spin" style={{animationDuration: '4s'}} />
                        </div>
                      </div> : null
                    }
                    {
                      data.state == 'free' || data.state == 'maintenance' || data.state == 'dry-run' ? 
                      <div className="w-full bg-white/60 backdrop-blur-sm rounded-xl px-4 py-4 shadow-md border border-white/30">
                        <div className='flex items-center justify-center'>
                          <div className={`text-2xl font-bold ${ 
                            data.state === 'finished' ? 'text-emerald-800' : 
                              data.state === 'loading' ? 'text-amber-800' : 
                                data.state === 'maintenance' ? 'text-red-800' : 
                                  data.state === 'dry-run' ? 'text-blue-800' : 'text-slate-800'
                          }`}>สถานะ: {data.status}</div>
                        </div>
                      </div> :
                      <div className="">
                        <div className='flex items-center justify-between'>
                          <div className={`text-lg font-semibold ${ 
                            data.state === 'finished' ? 'text-emerald-800' : 
                              data.state === 'loading' ? 'text-amber-800' : 
                                data.state === 'maintenance' ? 'text-red-800' : 
                                  data.state === 'dry-run' ? 'text-blue-800' : 'text-slate-800'
                          }`}>สถานะ: {data.status}</div>
                          <div className={`text-lg font-semibold ${ 
                            data.state === 'finished' ? 'text-emerald-800' : 
                              data.state === 'loading' ? 'text-amber-800' : 
                                data.state === 'maintenance' ? 'text-red-800' : 
                                  data.state === 'dry-run' ? 'text-blue-800' : 'text-slate-800'
                          }`}>{data.timeLoading}</div>
                        </div>
                      </div>
                    }
                  </div>
                  <div className={`w-full flex flex-col items-center justify-center h-auto gap-2 overflow-x-hidden ${ data.state == 'free' || data.state == 'maintenance' ? 'invisible' : 'visible' } `}>
                    <div className="animate-truck-enter">
                      <TruckModel />
                    </div>
                  </div>
                  <div className='w-full h-7'>
                     <img alt='logo' src={bayImg} className='w-full'/>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full col-span-5 row-span-3 '>
              <div className="bg-gray-100 rounded-md px-4 py-4">
                <h4 className="text-lg font-bold text-gray-700 mb-3">Queuing Management Status</h4>
                <div className="space-y-4">
                  <button className={`w-full ${ data.state === 'maintenance' ? 'bg-red-500' : 'bg-green-500' } text-white py-2 px-4 rounded-md text-lg font-medium`}>
                    { data.state === 'maintenance' ? 'MAINTENANCE MODE' : 'OPERATING MODE' }
                  <div className="text-xs opacity-80">Signal From DCS</div>
                  </button>
                  <div className="flex space-x-4">
                    <button className={`flex-1 ${ data.state === 'maintenance' ? 'bg-red-500 text-white' : data.state != 'dry-run' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700' } py-3 px-3 rounded-lg text-sm font-bold`}>
                      { data.state === 'maintenance' ? 'MANUAL QUEUING' : 'AUTO QUEUING' }
                    </button>
                    <button className={`flex-1 ${ data.state === 'dry-run' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700' } py-3 px-3 rounded-lg text-sm font-bold`}>
                      DRY RUN
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full col-span-5 row-span-4 '>
              <div className="bg-gray-100 rounded-lg px-4 py-4">
                <h4 className="text-lg font-bold text-gray-700 mb-3">Queuing Management</h4>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button 
                    className={`py-2 px-3 rounded-lg text-sm font-semibold ${
                      selectedAction === 'Auto Queuing' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-700 border'
                    }`}
                    onClick={() => {
                      setcountAction(0)
                      setSelectedAction('Auto Queuing')}
                    }
                  >
                    Auto Queuing
                  </button>
                  <button 
                    className={`py-2 px-3 rounded-lg text-sm font-semibold ${
                      selectedAction === 'Finish Dry Run' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-700 border'
                    }`}
                    onClick={() => {
                      setcountAction(0)
                      setSelectedAction('Finish Dry Run')}
                    }
                  >
                    Finish Dry Run
                  </button>
                  <button 
                    className={`py-2 px-3 rounded-lg text-sm font-semibold ${
                      selectedAction === 'Manual Queuing' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-700 border'
                    }`}
                    onClick={() => {
                      setcountAction(0)
                      setSelectedAction('Manual Queuing')}
                    }
                  >
                    Manual Queuing
                  </button>
                  <button 
                    className={`py-2 px-3 rounded-lg text-sm font-semibold ${
                      selectedAction === 'Assign' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white text-gray-700 border'
                    }`}
                    onClick={() => {
                      setcountAction(0)
                      setSelectedAction('Assign')}
                    }
                  >
                    Assign
                  </button>
                </div>
                
                <button className={`w-full ${
                      selectedAction === 'Cancle' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-gray-700 border'
                  } py-2 px-4 rounded-lg text-sm font-medium`}
                  onClick={() => {
                    setcountAction(10)
                    setSelectedAction('Cancle')}
                  }
                >
                  Cancel Queuing
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="p-6 bg-gray-100 rounded-b-xl flex justify-around space-x-4">
          <button onClick={onClose} className="px-8 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2">
            <span>⏮</span>
            <span>ย้อนกลับ</span>
          </button>
          <button onClick={() => { setOpenDataDialog(true);  }} className="px-8 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2">
            <span>ตกลง</span>
            <span>✓</span>
          </button>
        </div>
         <ManageDialog opens={openDataDialog} selectedAction={selectedAction} count={countAction} onSave={(st) => {
          console.log('dialog result: '+st);
          setcountAction(0);
          handleSave(st);
         }}></ManageDialog>
      </div>
    </div>
  );
};

export default QueueManageDialog;

