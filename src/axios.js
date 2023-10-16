import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8089/api/v1/'
// axios.interceptors.request.use(
//     config => {
//         if (config.url != '/login') {
//             config.headers['Authorization'] = window.localStorage.getItem('token');
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

export default axios