import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../dynamicBaseQuery";

export const withdrawalApi = createApi({
  reducerPath: "withdrawalApi",
  baseQuery: dynamicBaseQuery,
  tagTypes: ["Withdrawal"],
  endpoints: (builder) => ({
    getWithdrawals: builder.query({
      query: ({ limit, userId }) => ({
        url: `/withdrawal?limit=${limit}&userId=${userId || ""}`,
      }),
      providesTags: ["Withdrawal"],
    }),
    updateWithdrawal: builder.mutation({
      query: ({ id, body }) => ({
        url: `/withdrawal/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Withdrawal"],
    }),
  }),
});

export const { useGetWithdrawalsQuery, useUpdateWithdrawalMutation } =
  withdrawalApi;
