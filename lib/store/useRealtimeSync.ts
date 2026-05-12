"use client";

import { useEffect } from "react";
import { api } from "./api";
import { useAppDispatch } from "./hooks";

type CallsChangedPayload = {
  type?: string;
  reason?: string;
  call_id?: string;
};

const FALLBACK_REFRESH_MS =
  Number.parseInt(process.env.NEXT_PUBLIC_REALTIME_FALLBACK_MS ?? "", 10) ||
  10_000;
const ENABLE_SSE = process.env.NEXT_PUBLIC_ENABLE_SSE === "1";

function invalidateDashboardData(
  dispatch: ReturnType<typeof useAppDispatch>,
  callId?: string
) {
  const tags: Parameters<typeof api.util.invalidateTags>[0] = [
    { type: "Calls", id: "LIST" },
    "Overview",
    { type: "Analytics", id: "LIST" },
  ];
  if (callId) {
    tags.push({ type: "Call", id: callId });
  }

  dispatch(api.util.invalidateTags(tags));
}

/**
 * Refresh RTK Query caches whenever Retell webhook/manual sync data may have
 * changed.
 *
 * The hook is idempotent — many components can call it; we just need it
 * mounted once per app session (we mount it in the dashboard layouts).
 *
 * Behavior:
 *   - Polls subscribed queries on a short interval. This is reliable on Vercel
 *     because webhook writes and dashboard reads both go through MongoDB.
 *   - Optionally opens `EventSource('/api/realtime')` when
 *     `NEXT_PUBLIC_ENABLE_SSE=1` for single-instance/self-hosted deployments.
 *   - On `calls-changed`, invalidates list-level tags so all subscribed
 *     queries (calls list, overview, analytics) refetch in the background.
 *     If a `call_id` is included, the matching call-detail cache entry is
 *     invalidated too.
 */
export function useRealtimeSync(): void {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const es =
      ENABLE_SSE && typeof EventSource !== "undefined"
        ? new EventSource("/api/realtime")
        : null;

    const handleCallsChanged = (ev: MessageEvent) => {
      let parsed: CallsChangedPayload | null = null;
      try {
        parsed = JSON.parse(ev.data) as CallsChangedPayload;
      } catch {
        // ignore malformed payloads
      }

      invalidateDashboardData(dispatch, parsed?.call_id);
    };

    es?.addEventListener("calls-changed", handleCallsChanged as EventListener);

    const fallbackRefresh = window.setInterval(() => {
      if (!document.hidden) {
        invalidateDashboardData(dispatch);
      }
    }, FALLBACK_REFRESH_MS);

    return () => {
      window.clearInterval(fallbackRefresh);
      es?.removeEventListener(
        "calls-changed",
        handleCallsChanged as EventListener
      );
      es?.close();
    };
  }, [dispatch]);
}

/**
 * Tiny mount-only component for layouts: just calls the hook so the SSE
 * connection lives for the whole dashboard session without polluting the
 * layout component itself.
 */
export function RealtimeSync(): null {
  useRealtimeSync();
  return null;
}
