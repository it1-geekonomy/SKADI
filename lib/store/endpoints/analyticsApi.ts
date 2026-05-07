import { api } from "../api";
import type { AnalyticsPayload, AnalyticsRange } from "../types";

export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsPayload, { range: AnalyticsRange }>({
      query: ({ range }) => ({ url: "analytics", params: { range } }),
      providesTags: (_r, _e, arg) => [
        { type: "Analytics" as const, id: arg.range },
        { type: "Analytics" as const, id: "LIST" },
      ],
      keepUnusedDataFor: 300,
    }),
  }),
  overrideExisting: false,
});

export const { useGetAnalyticsQuery } = analyticsApi;
