import axios from 'axios';
import router from './router'

const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    headers: {
        'Content-Type': process.env.VUE_APP_MIME_TYPE,
        'Accept': process.env.VUE_APP_MIME_TYPE
    },
    withCredentials: process.env.VUE_APP_WITH_CREDENTIALS === 'true',
    transformResponse: [function (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }]
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor - fixed to use imported router
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            router.push('/');
        }
        return Promise.reject(error);
    }
);

const apiClientOnline = axios.create({
    baseURL: 'https://rbsi-uat.centralcoffeeandtea.com/api',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8'
    },
    withCredentials: false,
    transformResponse: [function (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }]
});

export default apiClient;
export { apiClientOnline };