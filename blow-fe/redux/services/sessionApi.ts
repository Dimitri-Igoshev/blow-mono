import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { config } from "@/common/env";

export const sessionApi = createApi({
	reducerPath: "sessionApi",
	refetchOnFocus: true,
	baseQuery: fetchBaseQuery({
		baseUrl: `${config.API_URL}/session`,
		prepareHeaders: (headers, { getState }) => {
			const token = localStorage.getItem("access-token");
			if (token) headers.set("Authorization", `Bearer ${token}`);

			return headers;
		},
	}),
	tagTypes: ["Session"],
	endpoints: (builder) => ({
		createSession: builder.mutation({
      query: (userId: string) => ({
          url: `/`,
          method: "POST",
          body: { userId },
      }),
    }),
    updateActivity: builder.mutation({
      query: (sessionId: string) => ({
          url: `/${sessionId}/activity`,
          method: "PATCH",
          body: { sessionId },
      })
    })
	}),
});

export const { useCreateSessionMutation, useUpdateActivityMutation } = sessionApi;