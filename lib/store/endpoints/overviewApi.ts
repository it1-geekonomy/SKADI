import { api } from "../api";
import type { OverviewResponse } from "../types";

export const overviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOverview: builder.query<OverviewResponse, { recentLimit?: number } | void>({
      query: (arg) => ({
        url: "overview",
        params: { recentLimit: arg?.recentLimit ?? 7 },
      }),
      providesTags: ["Overview"],
      keepUnusedDataFor: 120,
    }),
  }),
  overrideExisting: false,
});

export const { useGetOverviewQuery } = overviewApi;
