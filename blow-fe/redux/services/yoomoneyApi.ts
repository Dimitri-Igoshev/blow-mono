import { config } from '@/common/env'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  // ...что вернёт ЮMoney
};

export const yoomoneyApi = createApi({
  reducerPath: 'yoomoneyApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/yoomoney' }),
  endpoints: (builder) => ({
    exchangeCode: builder.mutation<TokenResponse, { code: string }>({
      query: ({ code }) => ({
        url: 'exchange',
        method: 'POST',
        body: {
          code,
          redirect_uri: config.YOOMONEY_REDIRECT_URI,
        },
      }),
    }),
  }),
});

export const { useExchangeCodeMutation } = yoomoneyApi;
