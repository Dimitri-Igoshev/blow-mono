import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/common/env";

export const topupApi = createApi({
  reducerPath: "topupApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.API_URL}/top-up`,
    // prepareHeaders: (headers, { getState }) => {
    //   const token = localStorage.getItem("access-token");

    //   if (token) headers.set("Authorization", `Bearer ${token}`);

    //   return headers;
    // },
  }),
  tagTypes: ["TopUp"],
  endpoints: (builder) => ({
    verifyToken: builder.mutation({
      query: (token) => ({
        url: '/verify',
        method: "POST",
        body: { token },
      })
    }),
  }),
});

export const {
  useVerifyTokenMutation
} = topupApi;
