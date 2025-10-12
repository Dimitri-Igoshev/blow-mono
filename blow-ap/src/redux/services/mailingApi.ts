import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../dynamicBaseQuery";

export const mailingApi = createApi({
  reducerPath: "mailingApi",
  baseQuery: dynamicBaseQuery,
  tagTypes: ["Mailing"],
  endpoints: (builder) => ({
    getMailings: builder.query({
      query: ({ search, limit }) => ({
        url: `/mailing?search=${search}&limit=${limit}`,
      }),
      providesTags: ["Mailing"],
    }),
    createMailing: builder.mutation({
      query: (body) => ({
        url: "/mailing",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Mailing"],
    }),
    updateMailing: builder.mutation({
      query: ({ id, body }) => ({
        url: `/mailing/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Mailing"],
    }),
    deleteMailing: builder.mutation({
      query: (id) => ({
        url: `/mailing/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Mailing"],
    }),
  }),
});

export const {
  useCreateMailingMutation,
  useDeleteMailingMutation,
  useGetMailingsQuery,
  useUpdateMailingMutation,
} = mailingApi;
