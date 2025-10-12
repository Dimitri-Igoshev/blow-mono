import api from '@/lib/axios';

export const login = (data: { email: string; password: string }) => api.post('/auth/login', data);

export const register = (data: { name: string; email: string; password: string }) =>
  api.post('/auth/register', data);

export const forgotPassword = (data: { email: string }) => api.post('/auth/forgot-password', data);

export const resetPassword = (data: { token: string; newPassword: string }) =>
  api.post('/auth/reset-password', data);
