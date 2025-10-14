"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

import { config } from "@/common/env";
import {
  useGetChatMessagesQuery,
  useGetChatsQuery,
} from "@/redux/services/chatApi";
import { useGetMeQuery } from "@/redux/services/userApi";

const fallbackSocketOrigin = "https://api.blow.ru";

const buildSocketOrigin = () => {
  const apiUrl = config.API_URL ?? `${fallbackSocketOrigin}/api`;
  const base =
    typeof window !== "undefined" ? window.location.origin : fallbackSocketOrigin;

  try {
    const url = new URL(apiUrl, base);

    if (/\/api\/?$/.test(url.pathname)) {
      url.pathname = url.pathname.replace(/\/api\/?$/, "");
    }

    url.search = "";
    url.hash = "";

    const normalized = url.toString();

    return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
  } catch {
    return apiUrl.replace(/\/api\/?$/, "") || fallbackSocketOrigin;
  }
};

const socket = io(buildSocketOrigin(), {
  withCredentials: true,
});

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
