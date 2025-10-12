import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { config } from "@/common/env";

export const paymentApi = createApi({
	reducerPath: "paymentApi",
	refetchOnFocus: true,
	baseQuery: fetchBaseQuery({
		baseUrl: `${config.API_URL}/payment`,
		prepareHeaders: (headers, { getState }) => {
			const token = localStorage.getItem("access-token");

			if (token) headers.set("Authorization", `Bearer ${token}`);

			return headers;
		},
	}),
	tagTypes: ["Payment"],
	endpoints: (builder) => ({
		createPayment: builder.mutation({
			query: (body) => ({
				url: "",
				method: "POST",
				body: body,
			}),
			invalidatesTags: ["Payment"],
		}),
		topUp: builder.mutation({
			query: (body) => ({
				url: "top-up",
				method: "POST",
				body,
			}),
		}),
	}),
});

export const { useCreatePaymentMutation, useTopUpMutation } = paymentApi;
