import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "@/common/env";

export const cityApi = createApi({
	reducerPath: "cityApi",
	refetchOnFocus: true,
	baseQuery: fetchBaseQuery({
		baseUrl: `${config.API_URL}/city`,
	}),
	tagTypes: ["City"],
	endpoints: (builder) => ({
		getCities: builder.query({
			query: () => `?limit=1000`,
			providesTags: ["City"],
		}),
	}),
});
export const { useGetCitiesQuery } = cityApi;
