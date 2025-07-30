import React, { useEffect, useState } from 'react';
import { X, Check, MapPin, Clock, Users } from 'lucide-react';
import { dateFormatParser } from '../../services/date-service';
import { selectDryRunQueue, selectLoadingQueue } from '../../services/http-service';
import { set } from 'date-fns';

const DataDetailDialog = ({ open, data, mode, type, onSave, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ค้นหาเลขทะเบียน');
  const [plateHeadNumber, setPlateHeadNumber] = useState('');
  const [plateTailNumber, setPlateTailNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [ queueData, setQueueData ] = useState(null);
  const [ bookingData, setBookingData ] = useState(null);
  const [countdown, setCountdown] = useState(0);


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
      const result = await selectLoadingQueue(queueData);
      if(result){
        setBookingData(result);
      }
    }
  };

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
          <h2 className="text-3xl font-semibold">{ bookingData && bookingData?.baynumber ? 'จองคิวสำเร็จ' : bookingData ? 'มีคิวก่อนหน้า' : 'Order Information' }</h2>
          <X  onClick={() => {
            setBookingData(null);
            onSave();
          }} ></X>
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
                      รอประมาณ {bookingData?.waitingtime || 'ไม่ทราบ'} นาที
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <Users className="w-6 h-6 text-amber-500 mr-4 mt-1" />
                    <span className="text-4xl text-amber-600 font-medium">
                      มีคิวก่อนหน้า {bookingData?.queuebefore || 'ไม่ทราบ'} คิว
                    </span>
                  </div>
                </div>
          
              </div>
            )}
            {bookingData?.message && (
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-red-600 text-2xl font-bold underline text-center">
                  กรุณาจดบันทึกหมายเลขคิวของคุณ
                </p>
              </div>
            )}
          </div>
        : (
          <div className='p-6 content-center'>
            <div className="flex flex-col border-collapse border border-gray-500">
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Order No.</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.Code || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Date of PTTLNG arrival</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.DateArrival ? dateFormatParser(new Date(queueData?.DateArrival), 'dd-MMM-yy') : '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Time of PTTLNG arrival</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.DateArrival ? dateFormatParser(new Date(queueData?.DateArrival), 'HH:mm') : '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Destination</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.DestinationName || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Carrier Name</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.Carrier || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Company</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.Company || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Front License</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.FontLicense || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Rear License</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.RearLicense || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Driver Name 1</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.Driver1 || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Driver Name 2</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.Driver2 || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Driver Name 3</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.Driver3 || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Product</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.Product || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Quantity of Product</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.IsFullTank ? 'FULL TANK' : 'NULL' || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">น้ำหนักรถเปล่าชั่งครั้งแรก</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.TareWeight || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">ปริมาณที่โหลดได้สูงสุด</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{queueData?.MaxWeight || '---'}</div>
              </div>
              <div className='flex text-center'>
                <div className="w-2/5 border border-gray-500 block text-gray-700 font-bold text-lg py-1">Total Weight</div>
                <div className="w-3/5 border border-gray-500 block text-gray-700 font-medium text-lg py-1">{(parseFloat(queueData?.TareWeight)??0)+(parseFloat(queueData?.MaxWeight)??0) || '---'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        { bookingData ?  null : (
          <div className="flex justify-between space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <button
              onClick={onClose}
              className="flex items-center space-x-2 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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