import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/common/env";

export const withdrawalApi = createApi({
	reducerPath: "withdrawalApi",
	refetchOnFocus: true,
	baseQuery: fetchBaseQuery({
		baseUrl: `${config.API_URL}/withdrawal`,
	}),
	tagTypes: ["Withdrawal"],
	endpoints: (builder) => ({
		createWithdrawal: builder.mutation({
			query: (body) => ({
				url: "",
				method: "POST",
				body: body,
			}),
			invalidatesTags: ["Withdrawal"],
		}),
	}),
});

export const { useCreateWithdrawalMutation } = withdrawalApi;
