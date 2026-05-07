// Shared API response/request types for RTK Query endpoints.
// Keep these in sync with the corresponding API route handlers.

export type TableCall = {
  call_id: string;
  caller: string;
  time: string;
  duration: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  to: string;
  direction: "Inbound" | "Outbound";
  outcome: string;
};

export type TranscriptMessage = {
  role: "agent" | "user";
  ts: string;
  text: string;
};

export type CallDetail = {
  id: string;
  caller: string;
  date: string;
  time: string;
  duration: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  to: string;
  direction: string;
  outcome: string;
  status: string;
  callStatusLabel: string;
  callId: string;
  version: number;
  cost: string;
  tokens: string;
  latency: string;
  disconnect: string;
  summary: string;
  transcript: TranscriptMessage[];
  agentLine: string;
  recordingUrl: string | null;
};

export type CallsListArgs = {
  range: "30d" | "7d" | "today";
  outcome: "all" | "booked" | "callback" | "missed";
  limit?: number;
  skip?: number;
};

export type CallsListResponse = {
  calls: TableCall[];
  total?: number;
};

export type CallDetailResponse = {
  call: CallDetail;
};

export type SyncResponse = {
  fetched?: number;
  inserted?: number;
  updated?: number;
  unchanged?: number;
  skipped_web_calls?: number;
  skipped_invalid?: number;
  removed_web_calls?: number;
  removed_empty_number_rows?: number;
  error?: string;
};

export type OverviewStats = {
  totalCalls: number;
  bookedCalls: number;
  bookingRate: number;
  avgDuration: string;
  todayCalls: number;
};

export type OverviewRow = {
  call_id: string;
  caller: string;
  time: string;
  duration: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  to: string;
  direction: "Inbound" | "Outbound";
  outcome: string;
};

export type OverviewResponse = {
  stats: OverviewStats;
  recentCalls: OverviewRow[];
};

export type AnalyticsRange = "30d" | "7d" | "month";

export type AnalyticsPayload = {
  range: string;
  totalCalls: number;
  outcomes: {
    booked: number;
    callback: number;
    notBooked: number;
  };
  previous?: {
    totalCalls: number;
    outcomes: {
      booked: number;
      callback: number;
      notBooked: number;
    };
    avgDuration: string;
  };
  daily: Array<{ _id: string; count: number }>;
  peakHour: string;
  avgDuration: string;
};
