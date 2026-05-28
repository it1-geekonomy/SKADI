"use client";

import React, { useEffect, useMemo, useState } from "react";

type ClickRow = {
  _id?: string;
  cta?: string;
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  user_agent?: string;
  referer?: string;
  path?: string;
  created_at?: string;
};

function formatWhen(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function shortUa(ua?: string): string {
  const s = (ua ?? "").trim();
  if (!s) return "—";
  return s.length > 72 ? `${s.slice(0, 72)}…` : s;
}

function deviceFromUa(ua?: string): "Mobile" | "Desktop" | "Unknown" {
  const s = (ua ?? "").toLowerCase();
  if (!s.trim()) return "Unknown";
  if (s.includes("mobile") || s.includes("android") || s.includes("iphone")) {
    return "Mobile";
  }
  return "Desktop";
}

function refererHost(ref?: string): string {
  const raw = (ref ?? "").trim();
  if (!raw) return "—";
  try {
    return new URL(raw).host || "—";
  } catch {
    return raw.length > 42 ? `${raw.slice(0, 42)}…` : raw;
  }
}

export default function CtaClicksPage() {
  const [rows, setRows] = useState<ClickRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(100);

  useEffect(() => {
    let alive = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/cta-clicks?limit=${limit}`, {
          method: "GET",
        });
        const data = (await res.json().catch(() => null)) as
          | { ok?: boolean; clicks?: ClickRow[]; error?: string }
          | null;
        if (!res.ok || data?.ok === false) {
          throw new Error(data?.error || `HTTP ${res.status}`);
        }
        if (alive) {
          setRows(Array.isArray(data?.clicks) ? data!.clicks! : []);
        }
      } catch (e) {
        if (alive) {
          setError(e instanceof Error ? e.message : "Failed to load clicks");
        }
      } finally {
        if (alive) setLoading(false);
      }
    };
    void run();
    return () => {
      alive = false;
    };
  }, [limit]);

  const count = rows.length;
  const geoPresent = useMemo(
    () => rows.some((r) => (r.country ?? "").trim() || (r.city ?? "").trim()),
    [rows]
  );

  return (
    <div className="p-6 space-y-6 font-geist bg-bg min-h-full">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <h1 className="text-[14px] font-medium text-text-main">CTA Clicks</h1>
          <p className="text-[11px] text-text-muted">
            Captures IP (via proxy headers), geo (when provided), and user-agent.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-muted">Show</span>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="bg-surface border border-border rounded-[10px] px-3 py-2 text-[12px] text-text-main outline-none"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
            <option value={500}>500</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] text-red-400">
          {error}
        </div>
      ) : null}

      <div className="card bg-surface border border-border rounded-[12px] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
          <div className="text-[12px] font-medium text-text-main">
            Recent clicks
          </div>
          <div className="text-[11px] text-text-muted">
            {loading ? "Loading…" : `${count} row(s)`}
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-[12px] text-text-muted">Loading…</div>
        ) : rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted border-b border-border whitespace-nowrap">
                    Time
                  </th>
                  <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted border-b border-border whitespace-nowrap">
                    CTA
                  </th>
                  <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted border-b border-border whitespace-nowrap">
                    IP
                  </th>
                  <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted border-b border-border whitespace-nowrap">
                    Device
                  </th>
                  {geoPresent ? (
                    <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted border-b border-border whitespace-nowrap">
                      Geo
                    </th>
                  ) : null}
                  <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted border-b border-border whitespace-nowrap">
                    Page
                  </th>
                  <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted border-b border-border whitespace-nowrap">
                    Referrer
                  </th>
                  <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted border-b border-border whitespace-nowrap">
                    User-Agent
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const geo = [r.city, r.region, r.country]
                    .map((v) => (v ?? "").trim())
                    .filter(Boolean)
                    .join(", ");
                  return (
                    <tr
                      key={r._id ?? `${r.created_at ?? ""}-${r.ip ?? ""}-${r.cta ?? ""}`}
                      className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors"
                    >
                      <td className="px-5 py-3 text-[12px] text-text-dim whitespace-nowrap">
                        {formatWhen(r.created_at)}
                      </td>
                      <td className="px-5 py-3 text-[12px] text-text-main whitespace-nowrap">
                        {(r.cta ?? "").trim() || "—"}
                      </td>
                      <td className="px-5 py-3 text-[12px] text-text-main whitespace-nowrap tabular-nums">
                        {(r.ip ?? "").trim() || "—"}
                      </td>
                      <td className="px-5 py-3 text-[12px] text-text-dim whitespace-nowrap">
                        {deviceFromUa(r.user_agent)}
                      </td>
                      {geoPresent ? (
                        <td className="px-5 py-3 text-[12px] text-text-dim whitespace-nowrap">
                          {geo || "—"}
                        </td>
                      ) : null}
                      <td className="px-5 py-3 text-[12px] text-text-dim whitespace-nowrap">
                        {(r.path ?? "").trim() || "—"}
                      </td>
                      <td
                        className="px-5 py-3 text-[12px] text-text-dim whitespace-nowrap"
                        title={(r.referer ?? "").trim() || undefined}
                      >
                        {refererHost(r.referer)}
                      </td>
                      <td
                        className="px-5 py-3 text-[12px] text-text-dim whitespace-nowrap"
                        title={(r.user_agent ?? "").trim() || undefined}
                      >
                        {shortUa(r.user_agent)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-[12px] text-text-muted">
            No clicks yet. Click the CTA once and refresh this page.
          </div>
        )}
      </div>
    </div>
  );
}

