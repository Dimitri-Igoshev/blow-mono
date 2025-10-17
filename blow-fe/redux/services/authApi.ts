import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/common/env";

// если нужен тип стора, импортируй RootState
// import type { RootState } from "../store";

export const authApi = createApi({
  reducerPath: "authApi",
  refetchOnFocus: true,
  baseQuery: fetchBaseQuery({
    baseUrl: `${config.API_URL}/auth`,
    prepareHeaders: (headers, { /* getState */ }) => {
      // Логика: если запрос помечен "без авторизации", НЕ подставляем токен
      const skip = headers.get("x-skip-auth") === "1";
      if (!skip) {
        const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;
        if (token) headers.set("Authorization", `Bearer ${token}`);
      } else {
        headers.delete("x-skip-auth"); // служебный заголовок наружу не отправляем
      }
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: "/registration",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    confirmation: builder.mutation({
      query: (body) => ({
        url: "/confirmation",
        method: "POST",
        body,
      }),
    }),
    recoveryPassword: builder.mutation({
      query: (body) => ({
        url: "/recovery-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/reset-password",
        method: "POST",
        body,
      }),
    }),

    // === Telegram ===
    // ЛОГИН/РЕГИСТРАЦИЯ: без Authorization
    telegramAuthLogin: builder.mutation({
      query: (body) => ({
        url: "/telegram",
        method: "POST",
        body,
        headers: { "x-skip-auth": "1" }, // <-- ключевое
      }),
    }),
    // ПРИВЯЗКА: с Authorization (без x-skip-auth)
    telegramAuthLink: builder.mutation({
      query: (body) => ({
        url: "/telegram",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useConfirmationMutation,
  useRecoveryPasswordMutation,
  useResetPasswordMutation,
  useTelegramAuthLoginMutation,
  useTelegramAuthLinkMutation,
} = authApi;
