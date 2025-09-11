import React, { useEffect, useState } from 'react';
import { X, Check, MapPin, Clock, Users } from 'lucide-react';
import { dateFormatParser } from '../../services/date-service';
import { selectDryRunQueue, selectLoadingQueue } from '../../services/http-service';
import { set } from 'date-fns';

const DataDetailDialog = ({ open, data, mode, type, truck, onSave, onClose, resultData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ค้นหาเลขทะเบียน');
  const [plateHeadNumber, setPlateHeadNumber] = useState('');
  const [plateTailNumber, setPlateTailNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [ queueData, setQueueData ] = useState(null);
  const [ bookingData, setBookingData ] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    const ConfirmedSelection = true;//window.confirm('คุณต้องการจองคิวหรือไม่ ?');
    if(ConfirmedSelection && queueData && queueData.ORDER_CODE && truck){
      const result = await selectLoadingQueue(queueData?.ORDER_CODE??'', truck??'');
      if(result){
        setBookingData(result);
        setIsLoading(false);
        if(result.message == "Duplicate Register Queue"){

        }
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setBookingData(resultData);
  }, [resultData]);

  useEffect(() => {
    let timer;
    if (bookingData) {
      setCountdown(0);
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev >= 59) {
            clearInterval(timer);
            setBookingData(null);
            onSave();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setCountdown(0);
    }
    return () => clearInterval(timer);
  }, [bookingData]);

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
          <h2 className="text-3xl font-semibold">{ bookingData && bookingData?.baynumber ? 'จองคิวสำเร็จ' : bookingData ? 'จองคิวสำเร็จ' : 'Order Information' }</h2>
          { bookingData ? 
            <X  onClick={() => {
              setBookingData(null);
              onSave();
            }} ></X>
            : null 
          }
        </div>

        {/* Content */}
        { bookingData ?  

          <div className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-36 h-36 bg-blue-100 rounded-full mb-3">
                <span className="text-8xl font-bold text-blue-600">
                  {bookingData?.queuenumber}
                </span>
              </div>
              <p className="text-gray-600 text-5xl">หมายเลขคิว</p>
            </div>
            { bookingData?.baynumber && bookingData?.baynumber.length > 0 ? (
              /* Available Bay */
              <div className="text-center">
                <div className="inline-flex items-center justify-center bg-green-50 rounded-xl px-12 py-4 mb-4">
                  <MapPin className="w-14 h-14 text-green-600 mr-8" />
                  <span className="text-5xl font-bold text-green-600">
                    ไปที่ Bay {bookingData?.baynumber}
                  </span>
                </div>
                {/* <p className="text-xl text-green-600 font-medium">พร้อมให้บริการ</p> */}
              </div>
            ) : (
              /* Waiting Queue */
              <div className="space-y-4">
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center justify-center mb-3">
                    <Clock className="w-12 h-12 text-amber-500 mr-4 mt-4" />
                    <span className="text-5xl font-bold text-amber-600">
                      รอประมาณ {bookingData?.waitingtime || '0'} นาที
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <Users className="w-6 h-6 text-amber-500 mr-4 mt-1" />
                    <span className="text-4xl text-amber-600 font-medium">
                      มีคิวก่อนหน้า {bookingData?.queuebefore || '0'} คิว
                    </span>
                  </div>
                </div>
          
              </div>
            )}
            { bookingData && bookingData?.message.includes('Successful') ? (
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-red-600 text-2xl font-bold underline text-center">
                  กรุณาจดบันทึกหมายเลขคิวของคุณ
                </p>
              </div>
            ) : (
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-red-600 text-2xl font-bold underline text-center">
                  ไม่สามารถลงทะเบียนได้ : { bookingData?.message }
                </p>
              </div>
            )}
          </div>

        : (
          <div className='px-6 py-3 content-center'>
            <div className="flex flex-col border-collapse border border-gray-500">
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Order No.</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.ORDER_CODE || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Date of PTTLNG arrival</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.DATEARRIVE ? dateFormatParser(new Date(queueData?.DATEARRIVE), 'dd-MMM-yy') : '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Time of PTTLNG arrival</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.DATEARRIVE ? dateFormatParser(new Date(queueData?.DATEARRIVE), 'HH:mm') : '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Destination</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.DESTINATION_NAME || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Carrier Name</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.CARRIER || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Company</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.COMPANY || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Front License</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.FRONT_LICENSE || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Rear License</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.REAR_LICENSE || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Driver Name 1</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.DRIVER1 || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Driver Name 2</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.DRIVER2 || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Driver Name 3</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.DRIVER3 || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Product</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.PRODUCT || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Quantity of Product</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.FULLTANK == 'y' ? 'FULL TANK' : 'NULL' || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">น้ำหนักรถเปล่าชั่งครั้งแรก</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.TAREWEIGHT || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">ปริมาณที่โหลดได้สูงสุด</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.MAXWEIGHT || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Total Weight</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{(parseFloat(queueData?.TAREWEIGHT)??0)+(parseFloat(queueData?.MAXWEIGHT)??0) || '---'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        { bookingData ?  null : (
          <div className="p-6 bg-gray-100 rounded-b-xl flex justify-around space-x-4">
            {/* Back Button */}
            <button
              onClick={onClose}
              className="px-8 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <span>X</span>
              <span>ปิด</span>
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
                  <span>กำลังบันทึก...</span>
                </>
              ) : (
                <>
                  <span>ตกลง</span>
                  <span>✓</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataDetailDialog;