import { createApi } from "@reduxjs/toolkit/query/react";
import { dynamicBaseQuery } from "../dynamicBaseQuery";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: dynamicBaseQuery,
  tagTypes: ["Message"],
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: ({ search, limit, userId }) => ({
        url: `chat/get/all-messages?search=${search}&limit=${limit}&userId=${userId || ""}`,
      }),
      providesTags: ["Message"],
    }),
    createMessage: builder.mutation({
      query: (body) => ({
        url: "chat",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Message"],
    }),
    getFakeMessages: builder.query({
      query: ({ search, limit }) => ({
        url: `chat/fake/all-messages?search=${search || ""}&limit=${limit || 10}`,
      }),
      providesTags: ["Message"],
    }),
    getFakeChats: builder.query({
      query: ({ search, limit }) => ({
        url: `chat/fake/chats?search=${search || ""}&limit=${limit || 10}`,
      }),
      providesTags: ["Message"],
    }),
    getChat: builder.query({
      query: (id) => ({
        url: `chat/${id}/messages`,
      }),
      providesTags: ["Message"],
    })
  }),
});

export const {
  useGetMessagesQuery,
  useCreateMessageMutation,
  useGetFakeMessagesQuery,
  useGetFakeChatsQuery,
  useGetChatQuery,
} = messageApi;
