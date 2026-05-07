"use client";

import React, { useCallback, useState } from "react";
import { CallTable } from "@/components/dashboard/CallTable";
import { CallDetailModal } from "@/components/dashboard/CallDetailModal";
import {
  useGetCallByIdQuery,
  useGetCallsQuery,
  useLazyGetCallsQuery,
  useSyncCallsMutation,
} from "@/lib/store/endpoints/callsApi";

type TimeRange = "30d" | "7d" | "today";
type OutcomeFilter = "all" | "booked" | "callback" | "missed";
const PAGE_SIZE = 15;

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

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  if (/[",\r\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

function fileKeyForRange(range: TimeRange): string {
  switch (range) {
    case "today":
      return "today";
    case "7d":
      return "last-7-days";
    default:
      return "last-30-days";
  }
}

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

export default function CallsPage() {
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>("all");
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [page, setPage] = useState(1);
  const skip = (page - 1) * PAGE_SIZE;

  const {
    data: callsData,
    isLoading: loading,
    isFetching,
    error: listError,
  } = useGetCallsQuery({
    range: timeRange,
    outcome: outcomeFilter,
    limit: PAGE_SIZE,
    skip,
  });

  const calls: TableCall[] = (callsData?.calls as TableCall[]) ?? [];
  const totalCalls = callsData?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCalls / PAGE_SIZE));
  const fromRow = totalCalls === 0 ? 0 : skip + 1;
  const toRow = Math.min(skip + calls.length, totalCalls);

  const [syncCalls, { isLoading: syncing }] = useSyncCallsMutation();
  const [fetchCallsForExport] = useLazyGetCallsQuery();

  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: detailData,
    isFetching: detailLoading,
    error: detailError,
  } = useGetCallByIdQuery(activeCallId ?? "", { skip: !activeCallId });

  const selectedCall: CallDetail | null = detailData?.call ?? null;

  // Sync/export errors live in local state; query errors are derived inline.
  const [actionError, setActionError] = useState<string | null>(null);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [toast, setToast] = useState<{ kind: "success" | "info" | "error"; message: string } | null>(null);
  const [exporting, setExporting] = useState(false);

  const queryErrorMessage = listError
    ? "Failed to load calls"
    : detailError
      ? "Failed to load call"
      : null;
  const error = actionError ?? queryErrorMessage;

  const showToast = useCallback((t: { kind: "success" | "info" | "error"; message: string }) => {
    setToast(t);
    window.setTimeout(() => setToast(null), 4200);
  }, []);

  const handleSyncFromRetell = async () => {
    setSyncNotice(null);
    setToast(null);
    setActionError(null);
    try {
      const data = await syncCalls().unwrap();

      const removed = typeof data.removed_web_calls === "number" ? data.removed_web_calls : 0;
      const fetched = typeof data.fetched === "number" ? data.fetched : 0;
      const inserted = typeof data.inserted === "number" ? data.inserted : 0;
      const updated = typeof data.updated === "number" ? data.updated : 0;
      const unchanged = typeof data.unchanged === "number" ? data.unchanged : 0;
      const skippedWeb = typeof data.skipped_web_calls === "number" ? data.skipped_web_calls : 0;
      const skippedInvalid = typeof data.skipped_invalid === "number" ? data.skipped_invalid : 0;

      const didChange = inserted > 0 || updated > 0;
      if (!didChange) {
        showToast({
          kind: "info",
          message: "Everything is already up to date. No new changes were found.",
        });
      }

      const parts = [
        `Fetched ${fetched} call(s) from Retell.`,
        `New: ${inserted}.`,
        `Updated: ${updated}.`,
        `Unchanged: ${unchanged}.`,
      ];
      if (skippedWeb > 0) parts.push(`Skipped web calls: ${skippedWeb}.`);
      if (skippedInvalid > 0) parts.push(`Skipped invalid: ${skippedInvalid}.`);
      if (removed > 0) parts.push(`Removed old web rows: ${removed}.`);

      if (didChange) {
        setSyncNotice(parts.join(" "));
      }
      // No manual reload required — `invalidatesTags` on the mutation
      // automatically refreshes the active calls/overview/analytics queries.
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === "object" && e && "data" in e
            ? "Sync failed"
            : "Sync failed";
      setActionError(msg);
      showToast({ kind: "error", message: msg });
    }
  };

  const handleRowClick = (call: TableCall) => {
    setActiveCallId(call.call_id);
    setIsModalOpen(true);
  };

  const handleExportCsv = async () => {
    setActionError(null);
    setSyncNotice(null);
    setToast(null);
    setExporting(true);
    try {
      // Lazy trigger goes through the same RTK Query cache; if the same
      // (range, outcome) is already cached fresh, this is instant.
      const result = await fetchCallsForExport({
        range: timeRange,
        outcome: outcomeFilter,
        limit: 5000,
        skip: 0,
      }).unwrap();

      const rows: TableCall[] = (result.calls as TableCall[]) ?? [];
      if (!rows.length) {
        showToast({ kind: "info", message: "No calls found for this filter." });
        return;
      }

      const header = ["Caller", "Time", "Duration", "Sentiment", "To", "Direction", "Outcome", "Call ID"];
      const lines = [
        header.join(","),
        ...rows.map((r) =>
          [
            csvEscape(r.caller),
            csvEscape(r.time),
            csvEscape(r.duration),
            csvEscape(r.sentiment),
            csvEscape(r.to),
            csvEscape(r.direction),
            csvEscape(r.outcome),
            csvEscape(r.call_id),
          ].join(",")
        ),
      ];

      const csv = lines.join("\r\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `calls_${fileKeyForRange(timeRange)}_${outcomeFilter}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      showToast({ kind: "success", message: `Exported ${rows.length} row(s) to CSV.` });
    } catch (e) {
      showToast({ kind: "error", message: e instanceof Error ? e.message : "Failed to export CSV" });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 font-geist bg-bg min-h-full">
      {toast ? (
        <div className="fixed top-[66px] right-6 z-[60]">
          <div
            className={`rounded-xl border px-4 py-3 text-[12px] shadow-lg backdrop-blur ${
              toast.kind === "error"
                ? "border-red-500/30 bg-red-500/10 text-red-300"
                : toast.kind === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-white/10 bg-surface/90 text-text-main"
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-1">
        <h1 className="text-[14px] font-medium text-text-main">Call History</h1>
        <p className="text-[11px] text-text-muted">
          Phone calls only — web / browser calls are not stored or listed.
        </p>
      </div>

      {syncNotice ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[12px] text-emerald-400">
          {syncNotice}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] text-red-400">
          {error}
        </div>
      ) : null}

      <div className="card bg-surface border border-border rounded-[12px] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-1.5 flex-wrap">
            <FilterButton
              label="All Outcomes"
              active={outcomeFilter === "all"}
              onClick={() => {
                setOutcomeFilter("all");
                setPage(1);
              }}
            />
            <FilterButton
              label="Booked"
              active={outcomeFilter === "booked"}
              onClick={() => {
                setOutcomeFilter("booked");
                setPage(1);
              }}
            />
            <FilterButton
              label="Callback"
              active={outcomeFilter === "callback"}
              onClick={() => {
                setOutcomeFilter("callback");
                setPage(1);
              }}
            />
            <FilterButton
              label="Not Booked"
              active={outcomeFilter === "missed"}
              onClick={() => {
                setOutcomeFilter("missed");
                setPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-end">
            <div className="flex items-center gap-1.5 border-r border-border pr-4">
              <FilterButton
                label="Last 30 Days"
                active={timeRange === "30d"}
                onClick={() => {
                  setTimeRange("30d");
                  setPage(1);
                }}
              />
              <FilterButton
                label="Last 7 Days"
                active={timeRange === "7d"}
                onClick={() => {
                  setTimeRange("7d");
                  setPage(1);
                }}
              />
              <FilterButton
                label="Today"
                active={timeRange === "today"}
                onClick={() => {
                  setTimeRange("today");
                  setPage(1);
                }}
              />
            </div>
            {/* Manual sync hidden for now; webhook auto-sync keeps calls updated. */}
            {/* <button
              type="button"
              onClick={() => void handleSyncFromRetell()}
              disabled={syncing}
              className="px-3 py-1 border border-border bg-surface-hover text-text-main text-[12px] font-medium rounded-lg hover:bg-surface3 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {syncing ? "Syncing…" : "Sync"}
            </button> */}
            <button
              type="button"
              onClick={() => void handleExportCsv()}
              disabled={exporting}
              className="px-3 py-1 bg-accent text-white text-[12px] font-medium rounded-lg hover:bg-accent/90 transition-colors"
            >
              {exporting ? "Exporting…" : "Export CSV"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[12px] text-text-muted">
            Loading calls…
          </div>
        ) : (
          <CallTable
            calls={calls}
            rangeSubtitle={rangeSubtitle(timeRange)}
            onRowClick={handleRowClick}
            startIndex={skip}
          />
        )}

        {!loading ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-t border-border bg-surface/50">
            <div className="text-[11px] text-text-muted">
              Showing {fromRow}-{toRow} of {totalCalls} call(s)
              {isFetching ? " · Refreshing…" : ""}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isFetching}
                className="px-3 py-1 rounded-lg border border-border bg-surface-hover text-[11px] font-medium text-text-main hover:bg-surface3 transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                Previous
              </button>
              <span className="px-2 text-[11px] text-text-muted">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isFetching}
                className="px-3 py-1 rounded-lg border border-border bg-surface-hover text-[11px] font-medium text-text-main hover:bg-surface3 transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {detailLoading && isModalOpen && !selectedCall ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-[12px] text-text-muted">
          Loading call…
        </div>
      ) : null}

      <CallDetailModal
        isOpen={isModalOpen && Boolean(selectedCall)}
        onClose={() => {
          setIsModalOpen(false);
        }}
        call={selectedCall}
      />
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
