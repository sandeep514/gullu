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
