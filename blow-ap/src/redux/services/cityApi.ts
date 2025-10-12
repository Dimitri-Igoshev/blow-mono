import { createApi } from '@reduxjs/toolkit/query/react';
import { dynamicBaseQuery } from '../dynamicBaseQuery';

export const cityApi = createApi({
  reducerPath: 'cityApi',
  baseQuery: dynamicBaseQuery,
  tagTypes: ['City'],
  endpoints: (builder) => ({
    getCities: builder.query({
      query: ({ search, limit }) => ({
        url: `/city?search=${search}&limit=${limit}`,
      }),
      providesTags: ['City'],
    }),
    createCity: builder.mutation({
      query: (body) => ({
        url: '/city',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['City'],
    }),
    updateCity: builder.mutation({
      query: ({ id, body }) => ({
        url: `/city/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['City'],
    }),
  }),
});

export const { useGetCitiesQuery, useCreateCityMutation, useUpdateCityMutation } = cityApi;
