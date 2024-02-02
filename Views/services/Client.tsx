import { create } from 'apisauce'
const apiClient = create({
  baseURL: 'http://3.143.116.199/public/api',
  headers: {},
})
export const imagePath = 'https://s3.us-east-2.amazonaws.com/uploadbygulluapp/%2F';
// export const imagePath = 'http://3.143.116.199/public/'
export default apiClient;