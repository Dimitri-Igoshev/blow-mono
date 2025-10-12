import { createApi } from '@reduxjs/toolkit/query/react';
import { dynamicBaseQuery } from '../dynamicBaseQuery';

export const topupApi = createApi({
  reducerPath: 'topupApi',
  baseQuery: dynamicBaseQuery,
  tagTypes: ['Topup'],
  endpoints: (builder) => ({
    getTopups: builder.query({
      query: ({ search, limit }) => ({
        url: `/top-up?search=${search}&limit=${limit}`,
      }),
      providesTags: ['Topup'],
    }),
  }),
});

export const { useGetTopupsQuery } = topupApi;
