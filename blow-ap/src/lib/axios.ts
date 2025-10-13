import axios from 'axios';

import { authStorage } from '@/redux/services/auth/storage';

const api = axios.create({
  // baseURL: "http://localhost:3000/api",
  // baseURL: 'https://api.kutumba.ru/api',
  baseURL: 'https://api.kutumba.ru/api',
});

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
