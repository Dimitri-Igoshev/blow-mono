import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { config } from "@/common/env";

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.API_URL}/services`,
    // prepareHeaders: (headers, { getState }) => {
    //   const token = localStorage.getItem('access-token')
    //   if (token) headers.set('Authorization', `Bearer ${token}`)

    //   return headers
    // },
  }),
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => "",
      providesTags: ["Service"],
    }),
  }),
});

export const { useGetServicesQuery } = serviceApi;
