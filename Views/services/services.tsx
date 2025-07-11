import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToastAndroid} from 'react-native';
import apiClient from './Client';
import {API_URLS} from './urls';

export const showToast = (message: any) => {
  ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    0,
    10,
  );
};

export const generateRandString = () => {
  return (Math.random() * (9999 - 1) + 1).toFixed(0);
};

export const post = (url: any, params: any) => {
  return new Promise((resolve, reject) => {
    apiClient.post(url, params).then(
      (res: any) => {
        console.log(res);
        if (res.data.data.status == 'true' || res.data.data.status == true) {
          resolve(res.data.data);
        } else {
          reject(res.data.data);
        }
      },
      err => {
        reject(err);
      },
    );
  });
};

// get business list
export const get = (url: any, postedData = {}) => {
  return new Promise((resolve, reject) => {
    apiClient.get(url, postedData).then(
      (response: any) => {
        resolve(response);
      },
      err => {
        reject(err);
      },
    );
  });
};

export const login = async (email: string, password: string) => {
  const response = await apiClient.post(API_URLS.login, {email, password});
  return response.data;
};

export const pendingOrders = async (id: any) => {
  const response = await apiClient.get(
    `${API_URLS.pendingOrders}?api_token=${id}`,
  );
  return response.data;
};

export const getGalleryList = async (id: any) => {
  const response = await apiClient.get(
    `${API_URLS.galleryList}?api_token=${id}`,
  );
  return response.data;
};

export const getVendorList = async (role: any, id: any) => {
  const response = await apiClient.get(
    `${API_URLS.vendorList}?role=${role}&api_token=${id}`,
  );
  return response.data;
};

export const getVendorById = async (role: any, vendorId: any, id: any) => {
  const response = await apiClient.get(
    `${API_URLS.getVendorById}?role=${role}&id=${vendorId}&api_token=${id}`,
  );
  return response.data;
};

export const updateVendor = async (data: any) => {
  const response = await apiClient.post(API_URLS.editVender, data);
  return response.data;
};

export const createVendor = async (data: any) => {
  const response = await apiClient.post(API_URLS.createVendor, data);
  return response.data;
};

export const getSalesmanList = async (role: any, id: any) => {
  const response = await apiClient.get(
    `${API_URLS.salesmanList}?role=${role}&api_token=${id}`,
  );
  return response.data;
};

export const getSalesmanById = async (role: any, salesmanId: any, id: any) => {
  const response = await apiClient.get(
    `${API_URLS.getSalesmanById}?role=${role}&id=${salesmanId}&api_token=${id}`,
  );
  return response.data;
};

export const createSalesman = async (data: any) => {
  const response = await apiClient.post(API_URLS.createSalesman, data);
  return response.data;
};

export const updateSalesman = async (data: any) => {
  const response = await apiClient.post(API_URLS.editSalesman, data);
  return response.data;
};

export const getOrderList = async (role: any, id: any) => {
  const response = await apiClient.get(
    `${API_URLS.getOrderList}?role=${role}&api_token=${id}`,
  );
  return response.data;
};
