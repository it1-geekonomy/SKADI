"use client";

import { useEffect } from "react";
import { api } from "./api";
import { useAppDispatch } from "./hooks";

type CallsChangedPayload = {
  type?: string;
  reason?: string;
  call_id?: string;
};

/**
 * Subscribe to the server's SSE stream and refresh RTK Query caches whenever
 * the backend reports new/changed call data (Retell webhook or manual sync).
 *
 * The hook is idempotent — many components can call it; we just need it
 * mounted once per app session (we mount it in the dashboard layouts).
 *
 * Behavior:
 *   - Opens `EventSource('/api/realtime')` on mount.
 *   - On `calls-changed`, invalidates list-level tags so all subscribed
 *     queries (calls list, overview, analytics) refetch in the background.
 *     If a `call_id` is included, the matching call-detail cache entry is
 *     invalidated too.
 *   - EventSource auto-reconnects with exponential backoff on network blips,
 *     so we don't hand-roll retry logic.
 */
export function useRealtimeSync(): void {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof window === "undefined" || typeof EventSource === "undefined") {
      return;
    }

    const es = new EventSource("/api/realtime");

    const handleCallsChanged = (ev: MessageEvent) => {
      let parsed: CallsChangedPayload | null = null;
      try {
        parsed = JSON.parse(ev.data) as CallsChangedPayload;
      } catch {
        // ignore malformed payloads
      }

      const tags: Parameters<typeof api.util.invalidateTags>[0] = [
        { type: "Calls", id: "LIST" },
        "Overview",
        { type: "Analytics", id: "LIST" },
      ];
      if (parsed?.call_id) {
        tags.push({ type: "Call", id: parsed.call_id });
      }

      dispatch(api.util.invalidateTags(tags));
    };

    es.addEventListener("calls-changed", handleCallsChanged as EventListener);

    return () => {
      es.removeEventListener(
        "calls-changed",
        handleCallsChanged as EventListener
      );
      es.close();
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
