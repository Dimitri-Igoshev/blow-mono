import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/common/env";

export const claimApi = createApi({
	reducerPath: "claimApi",
	refetchOnFocus: true,
	baseQuery: fetchBaseQuery({
		baseUrl: `${config.API_URL}/claim`,
	}),
	tagTypes: ["Claim"],
	endpoints: (builder) => ({
		createClaim: builder.mutation({
			query: (body) => ({
				url: "",
				method: "POST",
				body: body,
			}),
			invalidatesTags: ["Claim"],
		}),
	}),
});

export const { useCreateClaimMutation } = claimApi;
