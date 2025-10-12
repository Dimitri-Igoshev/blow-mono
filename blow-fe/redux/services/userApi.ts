import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { config } from "@/common/env";

type User = {
  id: number;
  name: string;
  email: number;
};

export const userApi = createApi({
  reducerPath: "userApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.API_URL}/user`,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("access-token");

      if (token) headers.set("Authorization", `Bearer ${token}`);

      return headers;
    },
  }),
  tagTypes: ["User", "Me"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => "me",
      providesTags: ["Me"],
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),
      providesTags: ["User", "Me"],
    }),
    getUsers: builder.query({
      query: ({ online, sex, city, minage, maxage, withPhoto, limit, random }) =>
        `?online=${online || ""}&sex=${sex || ""}&city=${city || ""}&minage=${minage || ""}&maxage=${maxage || ""}&withPhoto=${withPhoto || ""}&random=${random || ""}&limit=${limit || "16"}`,
      providesTags: ["User"],
    }),
    // createUser: builder.mutation({
    //   query: (body) => ({
    //     url: '',
    //     method: 'POST',
    //     body,
    //     formData: true
    //   }),
    //   invalidatesTags: ['User']
    // }),
    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}`,
        method: "PATCH",
        body,
        formData: true,
      }),
      invalidatesTags: ["User", "Me"],
    }),
    removeUser: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    setActivity: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}/activity`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["User"],
    }),
    newVisit: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}/visit`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["User", "Me"],
    }),
    createNote: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}/note`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["User", "Me"],
    }),
    updateNote: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}/note-update`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["User", "Me"],
    }),
    deleteNote: builder.mutation({
      query: ({ id, body }) => ({
        url: `/${id}/note-delete`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["User", "Me"],
    }),
    addBalance: builder.mutation({
      query: (body) => ({
        url: `/test/add-balance`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["User", "Me"],
    }),
    buyService: builder.mutation({
      query: (body) => ({
        url: `/buy/service`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["User", "Me"],
    }),
    buyContact: builder.mutation({
      query: (body) => ({
        url: `/buy/contact`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["User", "Me"],
    }),
    withdawal: builder.mutation({
      query: (body) => ({
        url: `/withdawal/money`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["User", "Me"],
    }),
    buyServicesKit: builder.mutation({
      query: (body) => ({
        url: `/buy/services-kit`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["User", "Me"],
    }),
    reiseProfile: builder.mutation({
      query: (id) => ({
        url: `/use/raise-profile`,
        method: "PATCH",
        body: { id },
      }),
      invalidatesTags: ["User", "Me"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetUserQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  useRemoveUserMutation,
  useSetActivityMutation,
  useNewVisitMutation,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useAddBalanceMutation,
  useBuyServiceMutation,
  useBuyContactMutation,
  useBuyServicesKitMutation,
  useReiseProfileMutation,
  useWithdawalMutation,
} = userApi;
