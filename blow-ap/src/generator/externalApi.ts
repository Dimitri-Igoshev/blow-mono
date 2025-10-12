import type { FetchArgs } from '@reduxjs/toolkit/query';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { RootState } from '@/redux/store';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const tokenCache: { accessToken: string | null } = { accessToken: null };

const dynamicBaseQuery: BaseQueryFn<string | FetchArgs, unknown, unknown> = async (
  args,
  api,
  extraOptions
) => {
  const state = api.getState() as RootState;
  const project = state.project.project;

  if (!project) {
    return { error: { status: 500, data: 'Project not loaded' } } as any;
  }

  const rawBaseQuery = fetchBaseQuery({
    baseUrl: project.apiUrl,
    prepareHeaders: (headers) => {
      if (tokenCache.accessToken) {
        headers.set('Authorization', `Bearer ${tokenCache.accessToken}`);
      }

      return headers;
    },
  });

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const loginRes = await rawBaseQuery(
      {
        url: '/auth/login',
        method: 'POST',
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

export const externalApi = createApi({
  reducerPath: 'externalApi',
  baseQuery: dynamicBaseQuery,
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ limit, active, sex, search }) => ({
        url: '/user/',
        params: {
          admin: 'true',
          limit,
          active,
          sex,
          search,
        },
      }),
      providesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    changeUserStatus: builder.mutation({
      query: ({ id, active }) => ({
        url: `/user/${id}`,
        method: 'PATCH',
        body: { status: active ? 'inactive' : 'active' },
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
  }),
});

export const { useLazyGetUsersQuery, useChangeUserStatusMutation } = externalApi;
