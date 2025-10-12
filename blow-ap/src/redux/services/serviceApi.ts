import { createApi } from '@reduxjs/toolkit/query/react';
import { dynamicBaseQuery } from '../dynamicBaseQuery';

export const serviceApi = createApi({
  reducerPath: 'serviceApi',
  baseQuery: dynamicBaseQuery,
  tagTypes: ['Service'],
  endpoints: (builder) => ({
    getServices: builder.query({
      query: ({ search, limit }) => ({
        url: `/services?search=${search}&limit=${limit}`,
      }),
      providesTags: ['Service'],
    }),
    updateService: builder.mutation({
      query: ({ id, body }) => ({
        url: `/services/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Service'],
    })
  }),
});

export const { useGetServicesQuery, useUpdateServiceMutation } = serviceApi;