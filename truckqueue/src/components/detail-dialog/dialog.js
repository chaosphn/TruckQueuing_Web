import React, { useEffect, useState } from 'react';
import { X, Check, MapPin, Clock, Users } from 'lucide-react';
import { dateFormatParser } from '../../services/date-service';
import { selectDryRunQueue, selectLoadingQueue } from '../../services/http-service';

const DataDetailDialog = ({ open, data, mode, type, onSave, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ค้นหาเลขทะเบียน');
  const [plateHeadNumber, setPlateHeadNumber] = useState('');
  const [plateTailNumber, setPlateTailNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [ queueData, setQueueData ] = useState(null);
  const [ bookingData, setBookingData ] = useState(null);


  useEffect(() => {
    if(data){
      setQueueData(data);
    }
  }, [data]);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const handleConfirm = () => {
    //console.log('Confirmed:', { activeTab, plateNumber, orderNumber });
    closeDialog();
  };

  const handleSave = async () => {
    const ConfirmedSelection = true;//window.confirm('คุณต้องการจองคิวหรือไม่ ?');
    if(ConfirmedSelection){
      if(type === 'multiple'){
        const result = await selectLoadingQueue(queueData);
        if(result){
          setBookingData(result);
        }
      } else if(type === 'single'){
        const result = await selectDryRunQueue(queueData);
        if(result){
          setBookingData(result);
        }
      } 
    }
  };

  if (!open) {
    return (
      <div></div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-semibold">{ bookingData ? 'จองคิวสำเร็จ' : 'Order Information' }</h2>
          <X  onClick={() => {
            setBookingData(null);
            onSave();
          }} ></X>
        </div>

        {/* Content */}
        { bookingData ?  
          <div className="p-8">
            {/* Queue Number */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-3">
                <span className="text-5xl font-bold text-blue-600">
                  {bookingData?.queuenumber}
                </span>
              </div>
              <p className="text-gray-600 text-3xl">หมายเลขคิว</p>
            </div>

            {bookingData?.baynumber && bookingData?.baynumber.length > 0 ? (
              /* Available Bay */
              <div className="text-center">
                <div className="inline-flex items-center justify-center bg-green-50 rounded-xl px-12 py-4 mb-4">
                  <MapPin className="w-8 h-8 text-green-600 mr-2" />
                  <span className="text-4xl font-bold text-green-600">
                    Bay {bookingData?.baynumber}
                  </span>
                </div>
                {/* <p className="text-xl text-green-600 font-medium">พร้อมให้บริการ</p> */}
              </div>
            ) : (
              /* Waiting Queue */
              <div className="space-y-4">
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center justify-center mb-3">
                    <Clock className="w-8 h-8 text-amber-500 mr-4 mt-2" />
                    <span className="text-4xl font-bold text-amber-600">
                      รอประมาณ {bookingData?.waitingtime || 'ไม่ทราบ'} นาที
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <Users className="w-6 h-6 text-amber-500 mr-4 mt-1" />
                    <span className="text-3xl text-amber-600 font-medium">
                      มีคิวก่อนหน้า {bookingData?.queuebefore || 'ไม่ทราบ'} คิว
                    </span>
                  </div>
                </div>
                
                {/* <div className="text-center">
                  <p className="text-gray-500 text-sm">
                    กรุณารอสักครู่ เราจะแจ้งเตือนเมื่อถึงคิวของคุณ
                  </p>
                </div> */}
              </div>
            )}

            {/* Status Message */}
            {/* {bookingData?.message && (
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm text-center">
                  {bookingData.message}
                </p>
              </div>
            )} */}
          </div>
        : (
          <div className="p-6 flex flex-col gap-2">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Order No:</label>
                <input
                  type="text"
                  value={queueData?.Code || ''}
                  disabled={true}
                  //onChange={(e) => handleInputChange('orderNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Date Arrival:</label>
                <input
                  type="text"
                  value={queueData?.DateArrival ? dateFormatParser(new Date(queueData?.DateArrival), 'dd-MM-yyyy') : ''}
                  disabled={true}
                  //onChange={(e) => handleInputChange('dateArrival', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Time Arrival:</label>
                <input
                  type="text"
                  value={queueData?.DateArrival ? dateFormatParser(new Date(queueData?.DateArrival), 'HH:mm:ss') : ''}
                disabled={true}
                  //onChange={(e) => handleInputChange('timeArrival', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">BOL No:</label>
                <input
                  type="text"
                  value={queueData?.bolNo || ''}
                disabled={true}
                  //onChange={(e) => handleInputChange('bolNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Destination:</label>
                <input
                  type="text"
                  value={queueData?.DestinationName || ''}
                disabled={true}
                  //onChange={(e) => handleInputChange('destination', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Carrier Name:</label>
                <input
                  type="text"
                  value={queueData?.Carrier || ''}
                disabled={true}
                  //onChange={(e) => handleInputChange('carrierName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Front License:</label>
                <input
                  type="text"
                  value={queueData?.FontLicense || ''}
                disabled={true}
                  //onChange={(e) => handleInputChange('frontLicense', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Back License:</label>
                <input
                  type="text"
                  value={queueData?.RearLicense || ''}
                disabled={true}
                  //onChange={(e) => handleInputChange('backLicense', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Row 4 - Drivers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Driver 1:</label>
                <input
                  type="text"
                  value={queueData?.Driver1 || ''}
                disabled={true}
                  //onChange={(e) => handleInputChange('driver1', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Driver 2:</label>
                <input
                  type="text"
                  value={queueData?.Driver2 || ''}
                disabled={true}
                  //onChange={(e) => handleInputChange('driver2', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Driver 3:</label>
                <input
                  type="text"
                  value={queueData?.Driver3 || ''}
                disabled={true}
                  //onChange={(e) => handleInputChange('driver3', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Approve By:</label>
                <input
                  type="text"
                  value={queueData?.ApproveName || ''}
                disabled={true}
                  //onChange={(e) => handleInputChange('approveBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Customer:</label>
                <input
                  type="text"
                  value={queueData?.Company || ''}
                disabled={true}
                  //onChange={(e) => handleInputChange('customer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Product:</label>
                <input
                  type="text"
                  value={queueData?.Product || ''}
                disabled={true}
                  //onChange={(e) => handleInputChange('product', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Row 6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <input
                  type="text"
                  value={queueData?.Quantity || ''}
                disabled={true}
                  //onChange={(e) => handleInputChange('quantity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">IsFullTank:</label>
                <select
                  value={queueData?.IsFullTank || ''}
                disabled={true}
                  //onChange={(e) => handleInputChange('isFullTank', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="TRUE">TRUE</option>
                  <option value="FALSE">FALSE</option>
                </select>
              </div>
            </div>

            {/* Row 7 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Tare Weight:</label>
                <input
                  type="text"
                  value={queueData?.TareWeight || ''}
                disabled={true}
                  //onChange={(e) => handleInputChange('tareWeight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Max Weight:</label>
                <input
                  type="text"
                  value={queueData?.MaxWeight || ''}
                disabled={true}
                  //onChange={(e) => handleInputChange('maxWeight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Row 8 */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Vehicle Name:</label>
              <input
                type="text"
                value={queueData?.VehicleName || ''}
              disabled={true}
                  //onChange={(e) => handleInputChange('vehicleName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        { bookingData ?  null : (
          <div className="flex justify-between space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <X className="w-4 h-4" />
              <span>ปิด</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <span>ยืนยัน</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataDetailDialog;