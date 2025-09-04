import React, { useState } from 'react';
import { getDatabyOrder, getDatabyPlateNumber, getQueueDataByOrder } from '../../services/http-service';
import NotFoundDialog from '../notfound-dialog/dialog';

const OrderDialog = ({ open, mode, title, onSave, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ค้นหาเลขออเดอร์');
  const [plateHeadNumber, setPlateHeadNumber] = useState('');
  const [plateTailNumber, setPlateTailNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const handleConfirm = () => {
    //console.log('Confirmed:', { activeTab, plateNumber, orderNumber });
    closeDialog();
  };

  const handleSave = async () => {
    setIsLoading(true);
    if(orderNumber > 0){
      const data = {
        type: activeTab,
        ordernumber: `D${orderNumber.toString()}`.trim(),
      };
      const result = await getQueueDataByOrder(data.ordernumber);
      if(result && result.length > 0){
        //console.log(result);
        setIsLoading(false);
        onSave({ mode: 'order', data: result, type: mode });
      } else {
        setIsLoading(false);
        setOpenAlert(true);
      }
    } else {
      setIsLoading(false);
      alert('กรุณากรอกข้อมูลให้ครบถ้วนก่อนและตรวจสอบความถูกต้องอีกครั้ง !');
    }
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
          <div className="flex flex-col justify-center gap-6">
              <div className='text-2xl font-semibold'>{title || ''}</div>
              <button
                onClick={() => setActiveTab('ค้นหาเลขออเดอร์')}
                className={`w-full text-3xl px-6 py-4 rounded-lg font-bold transition-all duration-200 ${
                    activeTab === 'ค้นหาเลขออเดอร์'
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'bg-blue-500 text-white hover:bg-blue-400'
                }`}
              >
                ค้นหาเลขออเดอร์
              </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="space-y-6">
            <div>
                <label className="block text-gray-700 font-medium mb-3 text-lg">
                  ป้อนเลขออเดอร์
                </label>
                <input
                  type="number"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-50"
                  placeholder="กรุณาใส่เลขออเดอร์"
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
      <NotFoundDialog opens={openAlert} onSave={() => setOpenAlert(false)}></NotFoundDialog>
    </div>
  );
};

export default OrderDialog;