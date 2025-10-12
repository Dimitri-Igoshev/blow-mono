import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { authStorage } from './auth/storage';
import { ENV } from '@/config/env'

export interface LoginRequest {
  email: string;
  password: string;
}
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
export interface ForgotPasswordRequest {
  email: string;
}
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
export interface User {
  id: string;
  email: string;
  name: string;
}

const baseQuery = fetchBaseQuery({
  // baseUrl: 'https://core.igoshev.de/api',
  // baseUrl: 'https://api.blow.ru/api',
  baseUrl: ENV.API_URL,
  prepareHeaders: (headers) => {
    const token = authStorage.getToken();

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<{ access_token: string }, LoginRequest>({
      query: (data) => ({ url: '/auth/login', method: 'POST', body: data }),
    }),
    register: builder.mutation<void, RegisterRequest>({
      query: (data) => ({ url: '/auth/register', method: 'POST', body: data }),
    }),
    forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
