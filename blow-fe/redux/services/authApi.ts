import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { config } from "@/common/env";

export const authApi = createApi({
  reducerPath: "authApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.API_URL}/auth`,
    // prepareHeaders: (headers, { getState }) => {
    //   const token = localStorage.getItem('access-token')
    //   if (token) headers.set('Authorization', `Bearer ${token}`)

    //   return headers
    // },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: "/registration",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    confirmation: builder.mutation({
      query: (body) => ({
        url: "/confirmation",
        method: "POST",
        body,
      }),
    }),
    recoveryPassword: builder.mutation({
      query: (body) => ({
        url: "/recovery-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useConfirmationMutation,
  useRecoveryPasswordMutation,
  useResetPasswordMutation,
} = authApi;
