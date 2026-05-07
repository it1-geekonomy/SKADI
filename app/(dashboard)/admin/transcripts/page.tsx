"use client";

import React, { useState } from "react";
import { CallDetailModal } from "@/components/dashboard/CallDetailModal";
import {
  useGetCallByIdQuery,
  useGetCallsQuery,
} from "@/lib/store/endpoints/callsApi";

type TimeRange = "30d" | "7d" | "today";
type OutcomeFilter = "all" | "booked" | "callback" | "missed";

type TableCall = {
  call_id: string;
  caller: string;
  time: string;
  duration: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  to: string;
  direction: "Inbound" | "Outbound";
  outcome: string;
};

type CallDetail = React.ComponentProps<typeof CallDetailModal>["call"];

function rangeSubtitle(range: TimeRange): string {
  switch (range) {
    case "30d":
      return "Last 30 days";
    case "today":
      return "Today";
    default:
      return "Last 7 days";
  }
}

export default function TranscriptsPage() {
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>("all");
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");

  const {
    data: callsData,
    isLoading: loading,
    error: listError,
  } = useGetCallsQuery({
    range: timeRange,
    outcome: outcomeFilter,
    limit: 50,
    skip: 0,
  });
  const filteredCalls: TableCall[] = (callsData?.calls as TableCall[]) ?? [];

  const [activeId, setActiveId] = useState<string | null>(null);

  const {
    data: detailData,
    isFetching: detailLoading,
    error: detailError,
  } = useGetCallByIdQuery(activeId ?? "", { skip: !activeId });

  const selectedCall: CallDetail | null = detailData?.call ?? null;

  const error = listError
    ? "Failed to load calls"
    : detailError
      ? "Failed to load transcript"
      : null;

  const handleRowClick = (call: TableCall) => {
    setActiveId(call.call_id);
  };

  return (
    <div className="p-6 space-y-6 font-geist bg-bg min-h-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-[14px] font-medium text-text-main">Transcripts</h1>
        <p className="text-[11px] text-text-muted">
          Select a call to review the transcript and audio (phone calls only).
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] text-red-400">
          {error}
        </div>
      ) : null}

      <div className="card bg-surface border border-border rounded-[12px] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <FilterButton label="All" active={outcomeFilter === "all"} onClick={() => setOutcomeFilter("all")} />
              <FilterButton label="Booked" active={outcomeFilter === "booked"} onClick={() => setOutcomeFilter("booked")} />
              <FilterButton label="Callback" active={outcomeFilter === "callback"} onClick={() => setOutcomeFilter("callback")} />
              <FilterButton label="Not Booked" active={outcomeFilter === "missed"} onClick={() => setOutcomeFilter("missed")} />
            </div>

            <div className="flex items-center gap-1.5 border-l border-border pl-3">
              <FilterButton label="Last 30 Days" active={timeRange === "30d"} onClick={() => setTimeRange("30d")} />
              <FilterButton label="Last 7 Days" active={timeRange === "7d"} onClick={() => setTimeRange("7d")} />
              <FilterButton label="Today" active={timeRange === "today"} onClick={() => setTimeRange("today")} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] h-[calc(100vh-230px)] overflow-hidden">
          {/* Left: transcript list */}
          <div className="border-r border-border min-h-0 flex flex-col">
            <div className="px-4 py-3 border-b border-border">
              <div className="text-[12px] font-medium text-text-main">Calls</div>
              <div className="text-[11px] text-text-muted">{rangeSubtitle(timeRange)}</div>
            </div>

            {loading ? (
              <div className="p-6 text-[12px] text-text-muted">Loading…</div>
            ) : filteredCalls.length ? (
              <div className="min-h-0 flex-1 overflow-y-auto">
                {filteredCalls.map((c, idx) => {
                  const active = activeId === c.call_id;
                  return (
                    <button
                      key={c.call_id}
                      type="button"
                      onClick={() => handleRowClick(c)}
                      className={`w-full text-left px-4 py-3 border-b border-border hover:bg-surface-hover transition-colors ${
                        active ? "bg-surface2" : "bg-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[12px] font-medium text-text-main">
                            <span className="text-text-muted tabular-nums">{idx + 1}.</span> {c.caller}
                          </div>
                          <div className="mt-1 text-[11px] text-text-muted">{c.time}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <OutcomePill outcome={c.outcome} />
                          <div className="text-[10px] text-text-muted">{c.duration}</div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <SentimentPill sentiment={c.sentiment} />
                        <div className="text-[11px] text-text-dim">{c.direction}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-[12px] text-text-main font-medium">No calls found</div>
                <div className="mt-1 text-[11px] text-text-muted">Try changing filters or search.</div>
              </div>
            )}
          </div>

          {/* Right: transcript reader */}
          <div className="p-5 bg-bg/30 min-h-0 flex flex-col">
            {!activeId ? (
              <div className="h-full min-h-[380px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[13px] font-medium text-text-main">Select a call</div>
                  <div className="mt-1 text-[11px] text-text-muted">
                    Choose a call from the left to view transcript.
                  </div>
                </div>
              </div>
            ) : detailLoading && !selectedCall ? (
              <div className="h-full min-h-[380px] flex items-center justify-center text-[12px] text-text-muted">
                Loading transcript…
              </div>
            ) : selectedCall ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[14px] font-semibold text-text-main">
                      {selectedCall.date} · {selectedCall.time} · {selectedCall.direction}
                    </div>
                    <div className="mt-1 text-[11px] text-text-muted">
                      From <span className="font-mono">{selectedCall.caller}</span> →{" "}
                      <span className="font-mono">{selectedCall.to}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <OutcomePill outcome={selectedCall.outcome} />
                    <SentimentPill sentiment={selectedCall.sentiment} />
                  </div>
                </div>

                <div className="bg-surface-hover border border-border rounded-[10px] p-3">
                  {selectedCall.recordingUrl ? (
                    <audio
                      key={selectedCall.recordingUrl}
                      controls
                      preload="metadata"
                      className="w-full h-10"
                      src={selectedCall.recordingUrl}
                    />
                  ) : (
                    <div className="text-[11px] text-text-muted">
                      Recording not available for this call.
                    </div>
                  )}
                </div>

                <div className="bg-surface border border-border rounded-[12px] p-4 min-h-0 flex-1 overflow-y-auto">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted mb-3">
                    Transcript
                  </div>
                  {selectedCall.transcript?.length ? (
                    <div className="space-y-4">
                      {selectedCall.transcript.map((m, i) => (
                        <ChatBubble
                          key={i}
                          side={m.role === "agent" ? "right" : "left"}
                          ts={m.ts}
                          text={m.text}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-[12px] text-text-muted">No transcript in this payload.</div>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full min-h-[380px] flex items-center justify-center text-[12px] text-text-muted">
                No transcript loaded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all border ${
        active
          ? "bg-accent-glow border-accent text-accent"
          : "bg-surface-hover border-border text-text-dim hover:text-text-main"
      }`}
    >
      {label}
    </button>
  );
}

function OutcomePill({ outcome }: { outcome: string }) {
  const isBooked = outcome === "Appointment Booked";
  const isCallback = outcome === "Callback Requested";
  const isNotBooked = outcome === "Not Booked";

  const cls = isBooked
    ? "bg-green-500/10 text-green-600 border border-green-500/20"
    : isCallback
      ? "bg-yellow-500/10 text-yellow-700 border border-yellow-500/20"
      : isNotBooked
        ? "bg-slate-500/10 text-slate-600 border border-slate-500/20"
        : "bg-slate-500/10 text-slate-600 border border-slate-500/20";

  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${cls}`}>{outcome}</span>;
}

function SentimentPill({ sentiment }: { sentiment: TableCall["sentiment"] }) {
  const cls =
    sentiment === "Positive"
      ? "bg-green-500/10 text-green-500"
      : sentiment === "Neutral"
        ? "bg-yellow-500/10 text-yellow-500"
        : "bg-red-500/10 text-red-500";
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${cls}`}>{sentiment}</span>;
}

function ChatBubble({
  side,
  ts,
  text,
}: {
  side: "left" | "right";
  ts: string;
  text: string;
}) {
  const isRight = side === "right";
  const speakerLabel = isRight ? "Agent" : "User";
  return (
    <div className={`flex ${isRight ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[78%] min-w-[120px]">
        <div
          className={`px-1 mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${
            isRight ? "text-accent text-right" : "text-text-muted text-left"
          }`}
        >
          {speakerLabel}
        </div>
        <div
          className={`px-3 py-2.5 rounded-2xl text-[12px] leading-relaxed border shadow-sm ${
            isRight
              ? "bg-accent-glow border-accent/30 text-text-main"
              : "bg-surface-hover border-border text-text-main"
          }`}
          style={{
            borderTopRightRadius: isRight ? 6 : undefined,
            borderTopLeftRadius: !isRight ? 6 : undefined,
          }}
        >
          {text}
        </div>
        <div className={`mt-1 text-[10px] text-text-muted font-mono ${isRight ? "text-right" : "text-left"}`}>
          {ts}
        </div>
      </div>
    </div>
  );
}
