import { createApi } from '@reduxjs/toolkit/query/react';
import { dynamicBaseQuery } from '../dynamicBaseQuery'

export const transactionApi = createApi({
  reducerPath: 'transactionApi',
  baseQuery: dynamicBaseQuery,
  tagTypes: ['Transaction'],
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: ({ status, type, method, limit }) => ({
        url: `/transaction?status=${status}&type=${type}&method=${method}&limit=${limit}`,
      }),
      providesTags: ['Transaction'],
    }),
    updateTransaction: builder.mutation({
      query: ({ id, body }) => ({
        url: `/transaction/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'Transaction' }],
    })
    // changeUserStatus: builder.mutation({
    //   query: ({ id, active }) => ({
    //     url: `/user/${id}`,
    //     method: 'PATCH',
    //     body: { status: active ? 'inactive' : 'active' },
    //   }),
    //   invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    // }),
  }),
});

export const { useGetTransactionsQuery, useUpdateTransactionMutation } = transactionApi;
