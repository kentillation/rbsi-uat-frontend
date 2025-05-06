import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    headers: {
        'Content-Type': process.env.VUE_APP_MIME_TYPE,
        'Accept': process.env.VUE_APP_MIME_TYPE
    },
    withCredentials: process.env.VUE_APP_WITH_CREDENTIALS,
    transformResponse: [function (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }]
});

const apiClientOnline = axios.create({
    baseURL: 'https://rbsi-uat-be.centralcoffeeandtea.com/api',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8'
    },
    withCredentials: process.env.VUE_APP_WITH_CREDENTIALS,
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