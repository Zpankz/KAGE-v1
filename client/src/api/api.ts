import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const backendURL = '';
const api = axios.create({
  baseURL: backendURL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
});

let accessToken: string | null = null;

export default api;
