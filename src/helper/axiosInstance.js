// axiosInstance.js
import axios from 'axios';
import Router from 'next/router'; // import Router instead of useRouter

// Create an instance of axios
const instance = axios.create();

// Add a request interceptor
instance.interceptors.request.use((config) => {
    const token = window.sessionStorage.getItem("token");
    //  if (!token) {
    //   console.error("❌ ERROR:", {
    //     page: "mypage",
    //     method: "fetchIncompleteProductOrders",
    //     message: "No token found. User might not be logged in.",
    //   });
    //   return;
    // }
    config.headers.Authorization =  token ? `Bearer ${token}` : '';
    // console.log('config', config);
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401 ) {
        console.error('Unauthorized access - redirecting to login...');
        Router.push('/unauthorized'); // use Router.push
    } else if (error.response && error.response.status === 403 ) {
        console.error('Forbidden access - redirecting to login...');
        Router.push('/forbidden'); // use Router.push
    }
    return Promise.reject(error);
});

module.exports = instance;