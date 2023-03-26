import { create } from 'apisauce'
const apiClient = create({
    baseURL: 'https://gullu.suryacontractors.com/public/api',
    headers: {  },
})
export const imagePath = 'https://gullu.suryacontractors.com/public/'
export default apiClient; 