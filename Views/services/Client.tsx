import { create } from 'apisauce'
const apiClient = create({
  baseURL: 'http://52.14.70.176/public/api',
  headers: {},
})
export const imagePath = 'https://s3.us-east-2.amazonaws.com/uploadbygulluapp/%2F';
// export const imagePath = 'http://52.14.70.176/public/'
export default apiClient;