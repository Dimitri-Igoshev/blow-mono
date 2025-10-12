import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { config } from "@/common/env";

export const uploadApi = createApi({
	reducerPath: "uploadApi",
	refetchOnFocus: true,
	baseQuery: fetchBaseQuery({
		baseUrl: `${config.API_URL}/file`,
		// prepareHeaders: (headers, { getState }) => {
		//   const token = localStorage.getItem('access-token')
		//   if (token) headers.set('Authorization', `Bearer ${token}`)

		//   return headers
		// },
	}),
	tagTypes: ["File"],
	endpoints: (builder) => ({
		upload: builder.mutation({
			query: (body) => ({
				url: "/upload",
				method: "POST",
				body,
				formData: true,
			}),
		}),
		heicToJpeg: builder.mutation<Blob, FormData>({
			query: (body) => ({
				url: "/heic-to-jpeg",
				method: "POST",
				body,
				formData: true,
				responseHandler: async (response) => await response.blob(), // ✅ ключевой момент
				responseType: "blob", // ⬅️ для fetch — важно
			}),
		}),
	}),
});

export const { useUploadMutation, useHeicToJpegMutation } = uploadApi;
