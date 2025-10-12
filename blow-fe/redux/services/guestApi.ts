import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/common/env";

export const guestApi = createApi({
	reducerPath: "guestApi",
	refetchOnFocus: true,
	baseQuery: fetchBaseQuery({
		baseUrl: `${config.API_URL}/guest`,
	}),
	tagTypes: ["Guest"],
	endpoints: (builder) => ({
		getGuests: builder.query({
			query: (id) => `/${id}`,
			providesTags: ["Guest"],
		}),
	}),
});

export const { useGetGuestsQuery } = guestApi;
