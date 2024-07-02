import axios from 'axios';

axios.defaults.withCredentials = false;

export function getCsrfCookie() {
  return axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie');
}
