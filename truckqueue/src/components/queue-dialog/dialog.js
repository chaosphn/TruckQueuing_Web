import React, { useState } from 'react';

const TruckQueueDialog = ({ open, mode, onSave, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ค้นหาเลขทะเบียน');
  const [plateHeadNumber, setPlateHeadNumber] = useState('');
  const [plateTailNumber, setPlateTailNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const handleConfirm = () => {
    //console.log('Confirmed:', { activeTab, plateNumber, orderNumber });
    closeDialog();
  };

  const handleSave = async () => {
    // if(activeTab =='ค้นหาเลขทะเบียน'){
    //     const data = {
    //       type: activeTab,
    //       headnumber: plateHeadNumber,
    //       tailnumber: plateTailNumber
    //     };
    //     if(plateHeadNumber.length > 0 && plateTailNumber.length > 0){
    //       const result = await getDatabyPlateNumber(data.headnumber, data.tailnumber);
    //       if(result && result.length > 0){
    //         console.log(result);
    //         onSave({ mode: 'plate', data: result, type: mode });
    //       } else {
    //         alert('ไม่พบข้อมูลการค้นหา\nกรุณาตรวจสอบอีกครั ้ง');
    //       }
    //     } else {
    //       alert('กรุณากรอกข้อมูลให้ครบถ้วนก่อนและตรวจสอบความถูกต้องอีกครั้ง !');
    //     }
    // } else {
    //     const data = {
    //       type: activeTab,
    //       ordernumber: orderNumber
    //     };
    //     if(orderNumber.length > 0){
    //       const result = await getDatabyOrder(data.ordernumber);
    //       if(result && result.length > 0){
    //         console.log(result);
    //         onSave({ mode: 'order', data: result, type: mode });
    //       } else {
    //         alert('ไม่พบข้อมูลการค้นหา\nกรุณาตรวจสอบอีกครั ้ง');
    //       }
    //     } else {
    //       alert('กรุณากรอกข้อมูลให้ครบถ้วนก่อนและตรวจสอบความถูกต้องอีกครั้ง !');
    //     }
    // }
  };

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
          {
            mode == 'multiple' ? 
            <div className="flex justify-center gap-6">
                <button
                onClick={() => setActiveTab('ค้นหาเลขทะเบียน')}
                className={`w-full text-xl px-6 py-4 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'ค้นหาเลขทะเบียน'
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'bg-blue-500 text-white hover:bg-blue-400'
                }`}
                >
                ค้นหาเลขทะเบียน
                </button>
                <button
                onClick={() => setActiveTab('ค้นหาเลขออเดอร์')}
                className={`w-full text-xl px-6 py-4 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'ค้นหาเลขออเดอร์'
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'bg-blue-500 text-white hover:bg-blue-400'
                }`}
                >
                ค้นหาเลขออเดอร์
                </button>
            </div> : 
            <div className="flex justify-center gap-6">
                <button
                onClick={() => setActiveTab('ค้นหาเลขทะเบียน')}
                className={`w-full text-xl px-6 py-4 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'ค้นหาเลขทะเบียน'
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'bg-blue-500 text-white hover:bg-blue-400'
                }`}
                >
                ค้นหาเลขทะเบียน
                </button>
            </div>
          }
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="space-y-6">
            {activeTab === 'ค้นหาเลขทะเบียน' ? (
              <>
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
                <div>
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
              </>
            ) : (
              <div>
                <label className="block text-gray-700 font-medium mb-3 text-lg">
                  ใส่เลขออเดอร์
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50"
                  placeholder="กรุณาใส่เลขออเดอร์"
                />
              </div>
            )}
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
    </div>
  );
};

export default TruckQueueDialog;