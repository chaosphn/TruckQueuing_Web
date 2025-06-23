import React, { useState, useEffect } from 'react';
import { Truck, Settings, Clock, MapPin, Gauge, Fuel } from 'lucide-react';

const CarrierManagement = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const carriers = [
    {
      id: 'A',
      status: 'โหลดเสร็จสิ้น',
      weight: '1,542 / 17,211 kg',
      pressure: '10/45 บาท',
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-800',
      icon: '✓'
    },
    {
      id: 'B',
      status: 'กำลังโหลด',
      weight: '1,542 / 17,211 kg',
      pressure: '10/45 บาท',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-800',
      icon: '⟳'
    },
    {
      id: 'C',
      status: 'อยู่ระหว่างซ่อมบำรุง',
      weight: '',
      pressure: '',
      color: 'from-red-400 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      icon: '⚠'
    },
    {
      id: 'D',
      status: 'Dry Run',
      weight: '0 kg',
      pressure: '',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      icon: '○'
    }
  ];

  const upcomingSlots = [
    { id: 4, available: true },
    { id: 5, available: true },
    { id: 6, available: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-xl shadow-lg">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Carrier Management</h1>
                <p className="text-slate-600">รายการสถานะรถขนส่ง</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-slate-800">
                {currentTime.toLocaleTimeString('th-TH')}
              </div>
              <div className="text-sm text-slate-600">
                วันพุธที่ 28 พฤษภาคม 2568
              </div>
            </div>
          </div>
        </div>

        {/* Active Carriers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* {carriers.map((carrier) => (
            <div
              key={carrier.id}
              className={`${carrier.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/50`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${carrier.color} rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {carrier.id}
                  </div>
                  <div className="text-2xl">{carrier.icon}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-700">คิวที่ {carrier.id === 'A' ? '1' : carrier.id === 'B' ? '2' : carrier.id === 'D' ? '3' : ''}</div>
                  <div className="text-sm text-slate-500">ทะเบียนหน้า 67-6255</div>
                  <div className="text-sm text-slate-500">ทะเบียนหลัง 67-6520</div>
                </div>
              </div>

              <div className={`${carrier.textColor} mb-4`}>
                <div className="font-semibold text-lg mb-2">สถานะ: {carrier.status}</div>
                {carrier.weight && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Gauge className="w-4 h-4" />
                      <span>{carrier.weight}</span>
                    </div>
                    {carrier.pressure && (
                      <div className="flex items-center gap-1">
                        <Fuel className="w-4 h-4" />
                        <span>{carrier.pressure}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {carrier.id !== 'C' && (
                <div className="flex items-center justify-center">
                  <div className="bg-white/80 rounded-lg p-3 shadow-md">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Truck className="w-8 h-8" />
                      <span className="text-xs font-medium">CARRIER TEST1</span>
                    </div>
                  </div>
                </div>
              )}

              {carrier.id === 'C' && (
                <div className="flex items-center justify-center">
                  <div className="bg-white/80 rounded-lg p-4 shadow-md">
                    <Settings className="w-12 h-12 text-red-500 animate-spin" style={{animationDuration: '3s'}} />
                  </div>
                </div>
              )}
            </div>
          ))} */}
        </div>

        {/* Upcoming Slots */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-600" />
            คิวถัดไป
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingSlots.map((slot) => (
              <div
                key={slot.id}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  slot.available 
                    ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300' 
                    : 'border-slate-300 bg-slate-100'
                }`}
              >
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${slot.available ? 'text-slate-700' : 'text-slate-900'}`}>
                    คิวที่ {slot.id}
                  </div>
                  
                  {slot.available ? (
                    <div className="space-y-2">
                      <div className="text-slate-600 text-sm">ทะเบียนหน้า 67-6255</div>
                      <div className="text-slate-600 text-sm">ทะเบียนหลัง 67-6520</div>
                      <div className="border-t border-slate-200 pt-3 mt-3">
                        <div className="text-slate-500 text-sm">คิวคอนหน้า 0 คิว</div>
                        <div className="text-slate-500 text-sm">รอประมาณ 30 นาที</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-2xl font-mono font-bold text-slate-800">
                        {currentTime.toLocaleTimeString('th-TH')}
                      </div>
                      <div className="text-sm text-slate-600">
                        วันพุธที่ 28 พฤษภาคม 2568
                      </div>
                      <div className="text-slate-500 text-sm mt-3">คิวคอนหน้า 0 คิว</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Legend */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">สถานะการทำงาน</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-slate-600">เสร็จสิ้น</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
              <span className="text-sm text-slate-600">กำลังดำเนินการ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm text-slate-600">ซ่อมบำรุง</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-slate-600">พร้อมใช้งาน</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrierManagement;