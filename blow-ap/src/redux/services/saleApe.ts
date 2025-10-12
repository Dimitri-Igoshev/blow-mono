import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../dynamicBaseQuery";

export const saleApi = createApi({
  reducerPath: "saleApi",
  baseQuery: dynamicBaseQuery,
  tagTypes: ["Sale"],
  endpoints: (builder) => ({
    getSales: builder.query({
      query: ({ limit, userId }) => ({
        url: `/sale?limit=${limit}&userId=${userId || ""}`,
      }),
      providesTags: ["Sale"],
    }),
    updateSale: builder.mutation({
      query: ({ id, body }) => ({
        url: `/sale/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Sale"],
    }),
  }),
});

export const { useGetSalesQuery, useUpdateSaleMutation } =
  saleApi;
