import { createApi } from '@reduxjs/toolkit/query/react';
import { dynamicBaseQuery } from '../dynamicBaseQuery';

export const sessionApi = createApi({
  reducerPath: 'sessionApi',
  baseQuery: dynamicBaseQuery,
  tagTypes: ['Session'],
  endpoints: (builder) => ({
    getSessions: builder.query({
      query: ({ limit, userId }) => ({
        url: `session?limit=${limit}&userId=${userId || ''}`,
      }),
      providesTags: ['Session'],
    }),
  }),
});

export const { useGetSessionsQuery } = sessionApi;