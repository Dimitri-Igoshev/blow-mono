import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { config } from "@/common/env";

export const mailingApi = createApi({
  reducerPath: "mailingApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.API_URL}/mailing`,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("access-token");

      if (token) headers.set("Authorization", `Bearer ${token}`);

      return headers;
    },
  }),
  tagTypes: ["Mailing"],
  endpoints: (builder) => ({
    getMailings: builder.query({
      query: () => "",
      providesTags: ["Mailing"],
    }),
    getMailingById: builder.query({
      query: (id) => `/${id}`,
    }),
    createMailing: builder.mutation({
      query: (body) => ({
        url: ``,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Mailing"],
    }),
    updateMailing: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["Mailing"],
    }),
    deleteMailing: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Mailing"],
    }),
  }),
});

export const {
  useGetMailingsQuery,
  useGetMailingByIdQuery,
  useCreateMailingMutation,
  useUpdateMailingMutation,
  useDeleteMailingMutation,
} = mailingApi;
