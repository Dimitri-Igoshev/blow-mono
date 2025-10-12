import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authStorage } from "./auth/storage";
import type { User } from "./authApi";
import { ENV } from "@/config/env"

const baseQuery = fetchBaseQuery({
  baseUrl: ENV.API_URL,
  prepareHeaders: (headers) => {
    const token = authStorage.getToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ search, status, sex, limit }) => ({
        url: `/user?limit=${limit || "20"}&status=${status || ""}&sex=${sex || ""}&admin=true&search=${search || ""}`,
      }),
      providesTags: ["User"],
    }),
    getFakes: builder.query({
      query: ({ search, limit }) => ({
        url: `/user/fake/all?limit=${limit || "20"}&search=${search || ""}`,
      }),
      providesTags: ["User"],
    }),
    getCount: builder.query({
      query: () => ({
        url: "/user/get/users/count",
      }),
      providesTags: ["User"],
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `/user/${id}`,
      }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, body }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    fetchMe: builder.query<User, void>({
      query: () => "/user/me",
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useFetchMeQuery,
  useGetCountQuery,
} = userApi;
