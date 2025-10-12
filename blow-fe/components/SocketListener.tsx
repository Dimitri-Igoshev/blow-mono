"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

import {
  useGetChatMessagesQuery,
  useGetChatsQuery,
} from "@/redux/services/chatApi";
import { useGetMeQuery } from "@/redux/services/userApi";

const socket = io("http://localhost:4000"); // ⚠️ адрес сервера

export const SocketListener = () => {
  const { data: me } = useGetMeQuery(null);
  const { data: chats, refetch } = useGetChatsQuery(me?.id, { skip: !me });
  const { data: messages, refetch: refetchMessages } = useGetChatMessagesQuery(
    chats?.[0]?._id,
    { skip: !chats },
  );

  useEffect(() => {
    socket.on("newMessage", (message) => {
      refetch();
      refetchMessages();
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  return null;
};
