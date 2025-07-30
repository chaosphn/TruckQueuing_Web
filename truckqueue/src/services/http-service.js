import axios from "axios";
import { bay_Status_Data, order_Data } from "../mockup/orderData";

let token = '';

const api = axios.create();
api.interceptors.request.use(config => {
    if (token) {
        config.headers['Authorization'] = token;
    } else {
        const tokenData = localStorage.getItem('token');
        if(tokenData){
            config.headers['Authorization'] = tokenData;
        };
    };
  return config;
}, error => {
  return Promise.reject(new Error(error));
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    console.log(error.response.status)
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // const response = await login();
        // console.log(response)
        // if(response == "login success."){
        //   api.defaults.headers.common['Authorization'] = `${token}`;
        //   return api(originalRequest);
        // }
        return api(originalRequest)
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(new Error(refreshError));
      }
    }
    return Promise.reject(new Error(error));
  }
);

export const login = async (username, password) => {
    try {
        if(!username || !password){
            return { error: 'username or password is null !' };
        } else {
            const result =  { data: true };//await api.post('/authen', body);
            if(result && result.data){
                //localStorage.setItem('authToken', 'xxxxxxx');
                return result.data;
            } else {
                return { error: 'username or password is invalid !' };
            };
        };
    } catch (error) {
        return { error: error.message };
    }
};

export const getDatabyOrder = async (orderNumber) => {
    try {
        const result = order_Data.filter(x => x.Code === orderNumber);//await api.post('', body);
        if(result && result.length > 0){
            return result;
        } else {
            return [];
        }
    } catch (error) {
        return error;
    }
};

export const getDatabyPlateNumber = async (headNumer, tailNumber) => {
    try {
        const result = order_Data.filter(x => x.FontLicense === headNumer && x.RearLicense === tailNumber);//await api.post('', body);
        if(result && result.length > 0){
            return result;
        } else {
            return [];
        }
    } catch (error) {
        return error;
    }
};

export const selectLoadingQueue = async (data) => {
    try {
        const result = Math.random();//order_Data.filter(x => x.FontLicense === headNumer && x.RearLicense === tailNumber);//await api.post('', body);
        console.log(result);
        if(result > 0.5){
            return {
                success: true,
                baynumber: 'A',
                queuenumber: parseInt(result * 10),
                waitingtime: 0,
                queuebefore: 0,
                message: 'Loading queue selected successfully.'
            };
        } else {
            return {
                success: false,
                baynumber: '',
                queuenumber: parseInt(result * 10),
                waitingtime: 60,
                queuebefore: 2,
                message: 'No free bay available.'
            };
        }
    } catch (error) {
        return error;
    }
};

export const selectDryRunQueue = async (data) => {
    try {
        const result = Math.random();//order_Data.filter(x => x.FontLicense === headNumer && x.RearLicense === tailNumber);//await api.post('', body);
        console.log(result);
        if(result > 0.5){
            return {
                success: true,
                baynumber: 'A',
                queuenumber: '2',
                waitingtime: 0,
                queuebefore: 0,
                message: 'Loading queue selected successfully.'
            };
        } else {
            return {
                success: false,
                baynumber: '',
                queuenumber: '6',
                waitingtime: 60,
                queuebefore: 2,
                message: 'No free bay available.'
            };
        }
    } catch (error) {
        return error;
    }
};

export const getBayStatusData = async () => {
    try {
        const result = bay_Status_Data.slice(0,4);//await api.post('', body);
        if(result && result.length > 0){
            return result;
        } else {
            return [];
        }
    } catch (error) {
        return error;
    }
};

export const getQueueData = async () => {
    try {
        const result = order_Data.slice(0,4);//await api.post('', body);
        if(result && result.length > 0){
            return result;
        } else {
            return [];
        }
    } catch (error) {
        return error;
    }
}