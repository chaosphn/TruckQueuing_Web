import React, { useState } from 'react';
import { getDatabyOrder, getDatabyPlateNumber, getQueueDataByLicense } from '../../services/http-service';
import NotFoundDialog from '../notfound-dialog/dialog';

const PlateDialog = ({ open, mode, title, onSave, onClose, ishead, topic, isDryRun }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ค้นหาเลขทะเบียน');
  const [plateHeadNumber, setPlateHeadNumber] = useState('');
  const [plateTailNumber, setPlateTailNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [openAlert, setOpenAlert] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const handleConfirm = () => {
    //console.log('Confirmed:', { activeTab, plateNumber, orderNumber });
    closeDialog();
  };

  const handleSave = async () => {
    const data = {
      type: activeTab,
      headnumber: plateHeadNumber,
      tailnumber: plateTailNumber
    };
    if(plateHeadNumber.length > 0 && plateTailNumber.length > 0){
      const result = await getQueueDataByLicense(data.headnumber.trim(), data.tailnumber.trim());
      if(result && result.length > 0){
        const filteredData = result.filter(x => new Date(x.DATEARRIVE).getTime() < getTomorrowMidnight())
        onSave({ mode: 'plate', data: filteredData, type: mode });
      } else {
        //alert('ไม่พบข้อมูลการค้นหา\nกรุณาตรวจสอบอีกครั ้ง');
        setOpenAlert(true);
      }
    } else {
      alert('กรุณากรอกข้อมูลให้ครบถ้วนก่อนและตรวจสอบความถูกต้องอีกครั้ง !');
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
                ใส่เลขทะเบียนหัว
              </label>
              <input
                type="text"
                value={plateHeadNumber}
                onChange={(e) => setPlateHeadNumber(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50"
                placeholder="กรุณาใส่เลขทะเบียนหัว"
              />
            </div>
            <div className={ ishead ? 'invisible' : '' }>
              <label className="block text-gray-700 font-medium mb-3 text-lg">
                ใส่เลขทะเบียนหาง
              </label>
              <input
                type="text"
                value={plateTailNumber}
                onChange={(e) => setPlateTailNumber(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50"
                placeholder="กรุณาใส่เลขทะเบียนหาง"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-100 rounded-b-xl flex justify-around space-x-4">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <span>⏮</span>
            <span>ย้อนกลับ</span>
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <span>ตกลง</span>
            <span>✓</span>
          </button>
        </div>
      </div>
      <NotFoundDialog opens={openAlert && !isDryRun} onSave={() => setOpenAlert(false)}></NotFoundDialog>
    </div>
  );
};

export default PlateDialog;