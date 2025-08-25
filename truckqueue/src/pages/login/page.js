import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react';
import backgroundImg from '../../assets/background.png';
import logoImg from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import TruckModel from '../../components/truck/truck-model';
import { login } from '../../services/http-service';

const LoginPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeNotifications, setActiveNotifications] = useState(3);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [checkData, setCheckData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNavigatePage = () => {
    navigate(`/overview`);
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('th-TH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckedChange = (e) => {
    //console.log(e);
    setCheckData(e.target.checked);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setIsIncorrect(false);
    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 500));
    const result = await login(formData.username, formData.password);
    if(result && !result.error){
        setIsLoading(false);
        setIsIncorrect(false);
        if(checkData){
            localStorage.setItem('authToken', result.token);
        } else {
            sessionStorage.setItem('authToken', result.token);
        }
        navigate(`/management`);
    } else {
      setIsLoading(false);
      setIsIncorrect(true);
    }
  };
  

  return (
    <div className="h-full min-h-screen relative overflow-hidden flex flex-col justify-between ">
      <div className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <img alt='bg' src={backgroundImg} className='w-full h-auto' />
      </div>
      
      <header className="relative z-10 bg-black/30 backdrop-blur-sm border-b border-white/50">
        <div className="mx-auto px-16 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3" onClick={handleNavigatePage}>
                {/* <div className="w-20 h-20 flex items-center justify-center shadow-lg">
                  <img src={logoImg} width={150} height={100} />
                </div> */}
                <img alt='logo' src={logoImg} width={100} height={100} className=''/>
                <div>
                  <h1 className="text-2xl font-bold text-white drop-shadow-lg">PTT LNG</h1>
                  <p className="text-blue-100 text-xl drop-shadow mt-1">ระบบบริหารจัดการคิวรถบรรทุก</p>
                </div>
              </div>
            </div>

            {/* <div className='h-auto scale-150'>
            <TruckModel></TruckModel>
            </div> */}
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-white font-mono text-3xl font-bold drop-shadow-lg">
                  {formatTime(currentTime)}
                </div>
                <div className="text-blue-100 text-xl drop-shadow mt-1">
                  {formatDate(currentTime)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

       <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl px-10 py-8 scale-110">
            <div className="text-center mb-8">
              {/* <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <LogIn className="w-10 h-10 text-white" />
              </div> */}
              <h2 className="text-3xl font-bold text-white mb-2">เข้าสู่ระบบ</h2>
              <p className="text-lg text-blue-100">กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
            </div>

            <div className="flex flex-col items-center justify-stretch gap-6">
              {/* Username Field */}
              <div className="w-full">
                <label className="text-white font-medium text-sm">ชื่อผู้ใช้</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-white/60" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/50 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    placeholder="กรอกชื่อผู้ใช้"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="w-full">
                <label className="text-white font-medium text-sm">รหัสผ่าน</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-white/60" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/50 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    placeholder="กรอกรหัสผ่าน"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
                    ) : (
                      <Eye className="w-5 h-5 text-white/60 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheckedChange(e)}
                    className="w-4 h-4 text-blue-400 bg-white/10 border-white/20 rounded focus:ring-blue-400 focus:ring-2"
                  />
                  <span className="ml-2 text-white/80 text-lg">จดจำการเข้าสู่ระบบ</span>
                </label>
              </div>

              {/* Alert */}
              {isIncorrect && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <span className="ml-2 text-red-500 text-xl font-semibold animate-slideDownFade">
                      username หรือ password ไม่ถูกต้อง !
                    </span>
                  </label>
                </div>
              )}



              {/* Login Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    กำลังเข้าสู่ระบบ...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LogIn className="w-5 h-5 mr-2" />
                    เข้าสู่ระบบ
                  </div>
                )}
              </button>
            </div>

            {/* Additional Info */}
            {/* <div className="mt-8 text-center">
              <p className="text-white/60 text-sm">
                ติดต่อ IT Support หากมีปัญหาการเข้าสู่ระบบ
              </p>
              <p className="text-white/60 text-xs mt-1">
                ext. 1234 | support@pttlng.com
              </p>
            </div> */}
          </div>
        </div>
      </main>

      <footer className="relative bg-black/20 backdrop-blur-sm border-t border-white/20">
        <div className="mx-auto px-16 py-6">
          <div className="flex items-center justify-between">
            <div className="text-white/80 text-sm drop-shadow">
              © 2025 PTT LNG Truck Loading System
            </div>
            <div className="flex items-center space-x-4 text-white/80 text-sm drop-shadow">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>System Online</span>
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;