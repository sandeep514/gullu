// import { create } from 'apisauce'
// const apiClient = create({
//   baseURL: 'http://3.143.116.199/public/api',
//   headers: {},
// })
export const imagePath =
  'https://s3.us-east-2.amazonaws.com/uploadbygulluapp/%2F';
// export const imagePath = 'http://3.143.116.199/public/';
// export default apiClient;

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LOCALSTORAGE from '../config/localStorage';
const apiClient = axios.create({
  baseURL: 'http://3.143.116.199/public/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getToken = async () => {
  const token = await AsyncStorage.getItem(LOCALSTORAGE.APITOKEN);
  return token;
};

apiClient.interceptors.request.use(
  async config => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error),
);

export default apiClient;
