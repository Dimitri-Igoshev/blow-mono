import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/common/env";

export const fileApi = createApi({
	reducerPath: "fileApi",
	refetchOnFocus: true,
	baseQuery: fetchBaseQuery({
		baseUrl: `${config.API_URL}/file`,
	}),
	tagTypes: ["File"],
	endpoints: (builder) => ({
		uploadFile: builder.mutation({
			query: (body) => ({
				url: "/upload",
				method: "POST",
				body: body,
        formData: true,
			}),
			invalidatesTags: ["File"],
		}),
	}),
});

export const { useUploadFileMutation } = fileApi;
