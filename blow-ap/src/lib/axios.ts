import axios from 'axios';

import { ENV } from '@/config/env';
import { authStorage } from '@/redux/services/auth/storage';

const api = axios.create({
  baseURL: ENV.API_URL,
});

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
