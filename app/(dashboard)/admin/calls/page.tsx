"use client";

import React, { useCallback, useEffect, useState } from "react";
import { CallTable } from "@/components/dashboard/CallTable";
import { CallDetailModal } from "@/components/dashboard/CallDetailModal";

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
  const [calls, setCalls] = useState<TableCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCall, setSelectedCall] = useState<CallDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [toast, setToast] = useState<{ kind: "success" | "info" | "error"; message: string } | null>(null);
  const [exporting, setExporting] = useState(false);

  const showToast = useCallback((t: { kind: "success" | "info" | "error"; message: string }) => {
    setToast(t);
    window.setTimeout(() => setToast(null), 4200);
  }, []);

  const loadCalls = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!opts?.silent) {
        setLoading(true);
      }
      setError(null);
      try {
        const params = new URLSearchParams({
          limit: "50",
          skip: "0",
          range: timeRange,
          outcome: outcomeFilter,
        });
        const res = await fetch(`/api/calls?${params}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Failed to load calls");
        }
        setCalls(data.calls ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load calls");
        setCalls([]);
      } finally {
        if (!opts?.silent) {
          setLoading(false);
        }
      }
    },
    [timeRange, outcomeFilter]
  );

  const handleSyncFromRetell = async () => {
    setSyncNotice(null);
    setToast(null);
    setSyncing(true);
    setError(null);
    try {
      const res = await fetch("/api/sync-calls", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Sync failed");
      }
      const removed =
        typeof data.removed_web_calls === "number" ? data.removed_web_calls : 0;
      const fetched = typeof data.fetched === "number" ? data.fetched : 0;
      const inserted = typeof data.inserted === "number" ? data.inserted : 0;
      const updated = typeof data.updated === "number" ? data.updated : 0;
      const unchanged = typeof data.unchanged === "number" ? data.unchanged : 0;
      const skippedWeb =
        typeof data.skipped_web_calls === "number" ? data.skipped_web_calls : 0;
      const skippedInvalid =
        typeof data.skipped_invalid === "number" ? data.skipped_invalid : 0;

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
      await loadCalls({ silent: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sync failed");
      showToast({
        kind: "error",
        message: e instanceof Error ? e.message : "Sync failed",
      });
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    void loadCalls();
  }, [loadCalls]);

  const handleRowClick = async (call: TableCall) => {
    setDetailLoading(true);
    setIsModalOpen(true);
    setSelectedCall(null);
    try {
      const res = await fetch(
        `/api/calls/${encodeURIComponent(call.call_id)}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to load call");
      }
      setSelectedCall(data.call ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load call");
      setIsModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleExportCsv = async () => {
    setError(null);
    setSyncNotice(null);
    setToast(null);
    setExporting(true);
    try {
      const params = new URLSearchParams({
        limit: "5000",
        skip: "0",
        range: timeRange,
        outcome: outcomeFilter,
      });
      const res = await fetch(`/api/calls?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to export CSV");

      const rows: TableCall[] = Array.isArray(data.calls) ? data.calls : [];
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
              onClick={() => setOutcomeFilter("all")}
            />
            <FilterButton
              label="Booked"
              active={outcomeFilter === "booked"}
              onClick={() => setOutcomeFilter("booked")}
            />
            <FilterButton
              label="Callback"
              active={outcomeFilter === "callback"}
              onClick={() => setOutcomeFilter("callback")}
            />
            <FilterButton
              label="Not Booked"
              active={outcomeFilter === "missed"}
              onClick={() => setOutcomeFilter("missed")}
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-end">
            <div className="flex items-center gap-1.5 border-r border-border pr-4">
              <FilterButton
                label="Last 30 Days"
                active={timeRange === "30d"}
                onClick={() => setTimeRange("30d")}
              />
              <FilterButton
                label="Last 7 Days"
                active={timeRange === "7d"}
                onClick={() => setTimeRange("7d")}
              />
              <FilterButton
                label="Today"
                active={timeRange === "today"}
                onClick={() => setTimeRange("today")}
              />
            </div>
            <button
              type="button"
              onClick={() => void handleSyncFromRetell()}
              disabled={syncing}
              className="px-3 py-1 border border-border bg-surface-hover text-text-main text-[12px] font-medium rounded-lg hover:bg-surface3 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {syncing ? "Syncing…" : "Sync"}
            </button>
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
          />
        )}
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
          setSelectedCall(null);
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
