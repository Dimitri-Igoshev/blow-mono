import { createApi } from '@reduxjs/toolkit/query/react';
import { dynamicBaseQuery } from '../dynamicBaseQuery';

export const claimApi = createApi({
  reducerPath: 'claimApi',
  baseQuery: dynamicBaseQuery,
  tagTypes: ['Claim'],
  endpoints: (builder) => ({
    getClaims: builder.query({
      query: ({ search, limit }) => ({
        url: `/claim?search=${search}&limit=${limit}`,
      }),
      providesTags: ['Claim'],
    }),
    updateClaim: builder.mutation({
      query: ({ id, body }) => ({
        url: `/claim/${id}`,
        method: 'PATCH',
        body,
      }),
    }),
  }),
});

export const { useGetClaimsQuery, useUpdateClaimMutation } = claimApi;
