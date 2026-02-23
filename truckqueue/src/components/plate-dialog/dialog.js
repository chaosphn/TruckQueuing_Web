import React, { useContext, useEffect, useState } from 'react';
import { getDatabyOrder, getDatabyPlateNumber, getQueueDataByLicense, selectDryRunQueue, selectOffLineModeQueue } from '../../services/http-service';
import NotFoundDialog from '../notfound-dialog/dialog';
import DataDetailDialog from '../detail-dialog/dialog';
import { QueueContext } from '../../utils/AppContext';
import AlertDialog from '../alert-dialog/dialog';

const PlateDialog = ({ open, mode, title, onSave, onClose, ishead, topic, isDryRun, truck_type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ค้นหาเลขทะเบียน');
  const [plateHeadNumber, setPlateHeadNumber] = useState(null);
  const [plateTailNumber, setPlateTailNumber] = useState(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [openAlert2, setOpenAlert2] = useState(false);
  const [ openDataDialog, setOpenDataDialog ] = useState(false);
  const [queuingData ,setQueuingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { apiStatus, updateApiStatus, tasStatus, updateTASStatus } = useContext(QueueContext);

  useEffect(() => {
    //console.log(isDryRun, mode, ishead)
  }, [open]);

  const handleSave = async () => {
    setIsLoading(true);
    if(isDryRun){
      if( !ishead && plateHeadNumber > 0 && plateTailNumber > 0){
        const result = await selectDryRunQueue(plateHeadNumber, plateTailNumber, truck_type);
        if(result){
          setQueuingData(result);
          setOpenDataDialog(true);
        }
        setIsLoading(false);
      } else if( ishead && plateHeadNumber > 0 ){
        const result = await selectDryRunQueue(plateHeadNumber, null, truck_type);
        if(result){
          setQueuingData(result);
          setOpenDataDialog(true);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        //alert('กรุณากรอกข้อมูลให้ครบถ้วนก่อนและตรวจสอบความถูกต้องอีกครั้ง !');
        setMessageAlert('กรุณากรอกข้อมูลให้ครบถ้วนก่อนและตรวจสอบความถูกต้องอีกครั้ง !');
        setOpenAlert2(true);
      }
    } else {
      if( tasStatus && tasStatus.OfflineMode === true ){
        const data = {
          type: activeTab,
          headnumber: plateHeadNumber,
          tailnumber: truck_type == '10-Wheel' ? plateHeadNumber : plateTailNumber
        };
        if(data.headnumber > 0 && data.tailnumber > 0){
          const result = await selectOffLineModeQueue(data.headnumber, data.tailnumber, truck_type);
          if(result){
            setQueuingData(result);
            setOpenDataDialog(true);
          }
          setIsLoading(false);
        } else {
          setIsLoading(false);
          //alert('กรุณากรอกข้อมูลให้ครบถ้วนก่อนและตรวจสอบความถูกต้องอีกครั้ง !');
          setMessageAlert('กรุณากรอกข้อมูลให้ครบถ้วนก่อนและตรวจสอบความถูกต้องอีกครั้ง !');
          setOpenAlert2(true);
        }
      } else {
        const data = {
          type: activeTab,
          headnumber: plateHeadNumber,
          tailnumber: truck_type == '10-Wheel' ? plateHeadNumber : plateTailNumber
        };
        if(data.headnumber > 0 && data.tailnumber > 0){
          const result = await getQueueDataByLicense(data.headnumber, data.tailnumber);
          if(result && result.length > 0){
            const filteredData = result.filter(x => new Date(x.DATEARRIVE).getTime() < getTomorrowMidnight());
            setIsLoading(false);
            onSave({ mode: 'plate', data: filteredData, type: mode });
          } else {
            //alert('ไม่พบข้อมูลการค้นหา\nกรุณาตรวจสอบอีกครั ้ง');
            setIsLoading(false);
            setOpenAlert(true);
          }
        } else {
          setIsLoading(false);
          //alert('กรุณากรอกข้อมูลให้ครบถ้วนก่อนและตรวจสอบความถูกต้องอีกครั้ง !');
          setMessageAlert('กรุณากรอกข้อมูลให้ครบถ้วนก่อนและตรวจสอบความถูกต้องอีกครั้ง !');
          setOpenAlert2(true);
        }
      }
    }
  };

  function getTomorrowMidnight() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1); 
    tomorrow.setHours(0, 0, 0, 0); 
    return tomorrow.getTime();
  }

  if (!open) {
    return (
      <div></div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto scale-125">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          {/* Tabs */}
          <div className="flex flex-col justify-center gap-6">
              { title && (
                <div className='text-2xl font-semibold'>{title || ''}</div>
              )}
              <button
                className={`w-full text-3xl px-6 py-4 rounded-lg font-bold transition-all duration-200 bg-white text-blue-700 shadow-md`}
              >
                {topic || 'ค้นหาเลขทะเบียน'}
              </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-3 text-lg">
                ป้อนเลขทะเบียนหัว (เฉพาะตัวเลข ไม่ต้องใส่ -)
              </label>
              <input
                type="number"
                value={plateHeadNumber}
                onChange={(e) => {
                  const val = e.target.value;
                  const clean = val.replace(/[^\d.]/g, '');
                  setPlateHeadNumber(clean)
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50"
                placeholder="กรุณาใส่เลขทะเบียนหัว"
              />
            </div>
            <div className={ ishead || truck_type == '10-Wheel' ? 'invisible' : '' }>
              <label className="block text-gray-700 font-medium mb-3 text-lg">
                ป้อนเลขทะเบียนหาง (เฉพาะตัวเลข ไม่ต้องใส่ -)
              </label>
              <input
                type="number"
                value={plateTailNumber}
                onChange={(e) => {
                  const val = e.target.value;
                  const clean = val.replace(/[^\d.]/g, '');
                  setPlateTailNumber(clean)
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50"
                placeholder="กรุณาใส่เลขทะเบียนหาง"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-100 rounded-b-xl flex justify-around space-x-4">
          {/* Back Button */}
          <button
            onClick={onClose}
            className="px-8 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <span>⏮</span>
            <span>ย้อนกลับ</span>
          </button>

          {/* Confirm Button */}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isLoading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  ></path>
                </svg>
                <span>กำลังค้นหา...</span>
              </>
            ) : (
              <>
                <span>ตกลง</span>
                <span>✓</span>
              </>
            )}
          </button>
        </div>
      </div>
      <NotFoundDialog opens={openAlert && !isDryRun} onSave={() => setOpenAlert(false)}></NotFoundDialog>
      <AlertDialog opens={openAlert2} message={messageAlert} onSave={() => {
        setOpenAlert2(false);
        setMessageAlert('');
      }} />
      <DataDetailDialog open={openDataDialog} data={null} mode={null} type={null} truck={truck_type} resultData={queuingData}
        onClose={() => {
          setOpenDataDialog(false);
          setQueuingData(null);
          onClose();
        }} 
        onSave={() => {
          setOpenDataDialog(false);
          setQueuingData(null);
          onClose();
        }}
      ></DataDetailDialog>
    </div>
  );
};

export default PlateDialog;