import { api } from "../api";
import type {
  CallDetailResponse,
  CallsListArgs,
  CallsListResponse,
  SyncResponse,
} from "../types";

export const callsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCalls: builder.query<CallsListResponse, CallsListArgs>({
      query: ({ range, outcome, limit = 50, skip = 0 }) => ({
        url: "calls",
        params: { range, outcome, limit, skip },
      }),
      providesTags: (_result, _err, arg) => [
        {
          type: "Calls" as const,
          id: `${arg.range}|${arg.outcome}|${arg.limit ?? 50}|${arg.skip ?? 0}`,
        },
        { type: "Calls" as const, id: "LIST" },
      ],
      keepUnusedDataFor: 120,
    }),

    getCallById: builder.query<CallDetailResponse, string>({
      query: (id) => `calls/${encodeURIComponent(id)}`,
      providesTags: (_r, _e, id) => [{ type: "Call" as const, id }],
      keepUnusedDataFor: 600,
    }),

    syncCalls: builder.mutation<SyncResponse, void>({
      query: () => ({ url: "sync-calls", method: "POST" }),
      invalidatesTags: [
        { type: "Calls", id: "LIST" },
        "Overview",
        "Analytics",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCallsQuery,
  useGetCallByIdQuery,
  useLazyGetCallByIdQuery,
  useLazyGetCallsQuery,
  useSyncCallsMutation,
} = callsApi;
