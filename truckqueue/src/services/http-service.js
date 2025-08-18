import axios from "axios";
import { bay_Status_Data, order_Data } from "../mockup/orderData";
import config from "../../src/assets/config.json";

let token = '';

const api = axios.create({
    baseURL: config.APIURL
});
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

export const getBaysData = async () => {
    try {
        const result = await api.post('/dashboard/get');
        //console.log(result.data)
        if(result && result.data ){
            return result.data;
        } else {
            return {
                MeterDashboard: [],
                WaitQueue: []
            };
        }
    } catch (error) {
        return {
            MeterDashboard: [],
            WaitQueue: []
        };
    }
}

export const getAllQueueData = async () => {
    try {
        const result = await api.post('/queue/all');
        if(result && result.data && result.data.length > 0){
            return result.data;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}

export const getAllRegisteredQueueData = async () => {
    try {
        const result = await api.post('/queue/get');
        if(result && result.data && result.data.length > 0){
            return result.data;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}


export const getQueueDataByLicense = async (front, rear) => {
    try {
        const body = {
            FrontLicense: front,
            RearLicense : rear
        }
        const result = await api.post('/queue/search', body);
        if(result && result.data && result.data.length > 0){
            return result.data;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}

export const getQueueDataByOrder = async (order) => {
    try {
        const body = {
            OrderCode: order
        }
        const result = await api.post('/queue/search', body);
        if(result && result.data && result.data.length > 0){
            return result.data;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}

export const getTotalQueueData = async () => {
    try {
        const body = {
            StartDate: null,
            EndDate: null,
            Dryrun: "n"
        }
        const result = await api.post('/queue/usage', body);
        if(result && result.data && result.data){
            return result.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

export const getPeriodQueueData = async (start, end, mode) => {
    try {
        const body = {
            StartDate: start,
            EndDate: end,
            Dryrun: mode
        }
        const result = await api.post('/queue/usage', body);
        if(result && result.data && result.data){
            return result.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

export const assignQueueDataToBay = async (id, bay) => {
    try {
        const body = {
            Q_ID: id,
            METER_NAME: bay
        }
        const result = await api.post('/queue/assign', body);
        if(result && result.data && result.data){
            return result.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

export const finishQueueDataAtBay = async (bay) => {
    try {
        const body = {
            METER_NAME: bay
        }
        const result = await api.post('/queue/finish', body);
        if(result && result.data && result.data){
            return result.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

export const cancleQueueAtBay = async (bay) => {
    try {
        const body = {
            METER_NAME: bay,
            CancelToRegister: "n"
        }
        const result = await api.post('/queue/cancel', body);
        if(result && result.data && result.data){
            return result.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

export const cancleQueueToRegister = async (bay) => {
    try {
        const body = {
            METER_NAME: bay,
            CancelToRegister: "y"
        }
        const result = await api.post('/queue/cancel', body);
        if(result && result.data && result.data){
            return result.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

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

export const selectLoadingQueue = async (code, truck) => {
    try {
         const body = {
            OrderCode: code,
            Trucktype : truck
        }
        const result = await api.post('/queue/register', body);
        if( result && result.data ){
            if(result?.data?.BayName){
                    return {
                        success: true,
                        baynumber: result?.data?.BayName,
                        queuenumber: result?.data?.QueueNo,
                        waitingtime: result?.data?.WaitTime,
                        queuebefore: result?.data?.PreviousQueue,
                        message: result?.data?.Message??''
                    };
            } else {
                return {
                    success: false,
                    baynumber: result?.data?.BayName,
                    queuenumber: result?.data?.QueueNo,
                    waitingtime: result?.data?.WaitTime,
                    queuebefore: result?.data?.PreviousQueue,
                    message: result?.data?.Message??''
                };
            }
        } else {
            return null;
        }
    } catch (error) {
        return error;
    }
};

export const selectDryRunQueue = async (front, rear, truck) => {
    try {
         const body = {
            frontLicense: front,
            rearLicense: rear,
            Trucktype : truck
        }
        const result = await api.post('/queue/registerdryrun', body);
        if( result && result.data ){
            if(result?.data?.BayName){
                    return {
                        success: true,
                        baynumber: result?.data?.BayName,
                        queuenumber: result?.data?.QueueNo,
                        waitingtime: result?.data?.WaitTime,
                        queuebefore: result?.data?.PreviousQueue,
                        message: result?.data?.Message??''
                    };
            } else {
                return {
                    success: false,
                    baynumber: result?.data?.BayName,
                    queuenumber: result?.data?.QueueNo,
                    waitingtime: result?.data?.WaitTime,
                    queuebefore: result?.data?.PreviousQueue,
                    message: result?.data?.Message??''
                };
            }
        } else {
            return null;
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