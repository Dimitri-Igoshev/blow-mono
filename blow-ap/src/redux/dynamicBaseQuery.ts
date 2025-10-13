import type { FetchArgs } from "@reduxjs/toolkit/query";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { RootState } from "@/redux/store";

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ENV } from "@/config/env"

const tokenCache: { accessToken: string | null } = {
  accessToken: localStorage.getItem("accessToken") || null,
};

export const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  const state = api.getState() as RootState;
  // const project = state.project.project;
  const project = {
    _id: "687059ff52b5bebf3df39225",
    name: "Blow",
    slug: "blow",
    // apiUrl: "https://api.kutumba.ru/api",
    apiUrl: ENV.API_URL,
    config: {
      themeColors: {
        primary: "#E31E24",
        secondary: "#2B2A29",
      },
      bgUrl: `${ENV.MEDIA_URL}/core/bg-blow.png`,
      logoUrl: `${ENV.MEDIA_URL}/core/BLOW%201.png`,
      logoBigUrl: `${ENV.MEDIA_URL}/core/BLOW%202.png`,
      faviconUrl: `${ENV.MEDIA_URL}/core/favicon.ico`,
    },
    owner: "68704800696a9aa45ce211a9",
    members: ["68704800696a9aa45ce211a9"],
    status: "active",
    createdAt: "2025-07-11T00:25:35.421Z",
    updatedAt: "2025-07-11T00:25:35.421Z",
    __v: 0,
    description: "Поиск лучших содержанок и самых успешных мужчин",
    // apiMediaUrl: "https://api.kutumba.ru",
    apiMediaUrl: ENV.MEDIA_URL,
    token: {
      email: "dimi.igoshev@gmail.com",
      password: "mungic-gysky9-Basjap",
    },
  };

  if (!project) {
    return { error: { status: 500, data: "Project not loaded" } } as any;
  }

  const rawBaseQuery = fetchBaseQuery({
    baseUrl: project.apiUrl,
    prepareHeaders: (headers) => {
      if (tokenCache.accessToken) {
        headers.set("Authorization", `Bearer ${tokenCache.accessToken}`);
      }

      return headers;
    },
  });

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const loginRes = await rawBaseQuery(
      {
        url: "/auth/login",
        method: "POST",
        body: {
          email: project.token?.email,
          password: project.token?.password,
        },
      },
      api,
      extraOptions
    );

    const accessToken = (loginRes.data as any)?.accessToken;

    if (accessToken) {
      tokenCache.accessToken = accessToken;
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};
