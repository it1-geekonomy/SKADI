"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AreaLineChart, OutcomesDonut } from "@/components/dashboard/AnalyticsViz";
import { StatsCard } from "@/components/dashboard/StatsCard";

type RangeKey = "30d" | "7d" | "month";

type AnalyticsPayload = {
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

function percent(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function deltaLabel(current: number, prev: number) {
  const d = current - prev;
  if (d === 0) return "No change";
  return `${d > 0 ? "+" : ""}${d} vs prev`;
}

function deltaPctLabel(currentPct: number, prevPct: number) {
  const d = currentPct - prevPct;
  if (d === 0) return "No change";
  return `${d > 0 ? "+" : ""}${d}% vs prev`;
}

function trendFromDelta(delta: number, inverse?: boolean) {
  if (delta === 0) return "neutral" as const;
  const up = delta > 0;
  if (inverse) return up ? ("down" as const) : ("up" as const);
  return up ? ("up" as const) : ("down" as const);
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/analytics?range=${range}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed to load analytics");
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load analytics");
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, [range]);

  const dailySeries = useMemo(() => {
    const rows = data?.daily ?? [];
    const clipped = rows.slice(-14);
    return clipped.map((r) => ({
      label: r._id.slice(8, 10),
      value: r.count ?? 0,
    }));
  }, [data]);

  const outcomes = useMemo(() => {
    const total = data?.totalCalls ?? 0;
    const booked = data?.outcomes.booked ?? 0;
    const callback = data?.outcomes.callback ?? 0;
    const notBooked = data?.outcomes.notBooked ?? 0;

    return [
      { label: "Appointment Booked", count: booked, pct: percent(booked, total), color: "bg-green-500" },
      { label: "Callback Requested", count: callback, pct: percent(callback, total), color: "bg-yellow-500" },
      { label: "Not Booked", count: notBooked, pct: percent(notBooked, total), color: "bg-red-500" },
    ];
  }, [data]);

  const subtitle = range === "7d" ? "Last 7 days" : range === "month" ? "This month" : "Last 30 days";

  const kpis = useMemo(() => {
    const total = data?.totalCalls ?? 0;
    const prevTotal = data?.previous?.totalCalls ?? 0;

    const booked = data?.outcomes.booked ?? 0;
    const prevBooked = data?.previous?.outcomes.booked ?? 0;

    const callback = data?.outcomes.callback ?? 0;
    const prevCallback = data?.previous?.outcomes.callback ?? 0;

    const notBooked = data?.outcomes.notBooked ?? 0;
    const prevNotBooked = data?.previous?.outcomes.notBooked ?? 0;

    const bookedRate = percent(booked, total);
    const prevBookedRate = percent(prevBooked, prevTotal);
    const callbackRate = percent(callback, total);
    const prevCallbackRate = percent(prevCallback, prevTotal);
    const notBookedRate = percent(notBooked, total);
    const prevNotBookedRate = percent(prevNotBooked, prevTotal);

    return {
      total,
      totalSub: deltaLabel(total, prevTotal),
      totalTrend: trendFromDelta(total - prevTotal),
      bookedRate,
      bookedSub: deltaPctLabel(bookedRate, prevBookedRate),
      bookedTrend: trendFromDelta(bookedRate - prevBookedRate),
      callbackRate,
      callbackSub: deltaPctLabel(callbackRate, prevCallbackRate),
      callbackTrend: trendFromDelta(callbackRate - prevCallbackRate),
      notBookedRate,
      notBookedSub: deltaPctLabel(notBookedRate, prevNotBookedRate),
      notBookedTrend: trendFromDelta(notBookedRate - prevNotBookedRate, true),
    };
  }, [data]);

  return (
    <div
      className="p-6 space-y-6 font-geist bg-bg min-h-full"
      suppressHydrationWarning
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[14px] font-medium text-text-main">Analytics</h1>
          <p className="text-[11px] text-text-muted">Performance Insights — {subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-surface border border-border rounded-lg">
          <button
            type="button"
            onClick={() => setRange("30d")}
            className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
              range === "30d"
                ? "bg-accent/20 text-accent border border-accent/30"
                : "text-text-dim hover:bg-surface-hover"
            }`}
          >
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={() => setRange("7d")}
            className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
              range === "7d"
                ? "bg-accent/20 text-accent border border-accent/30"
                : "text-text-dim hover:bg-surface-hover"
            }`}
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => setRange("month")}
            className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
              range === "month"
                ? "bg-accent/20 text-accent border border-accent/30"
                : "text-text-dim hover:bg-surface-hover"
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] text-red-400">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[14px]">
        <StatsCard
          label="Total calls"
          value={loading ? "—" : String(kpis.total)}
          subValue={loading ? undefined : kpis.totalSub}
          trend={loading ? undefined : kpis.totalTrend}
        />
        <StatsCard
          label="Booking rate"
          value={loading ? "—" : `${kpis.bookedRate}%`}
          subValue={loading ? undefined : kpis.bookedSub}
          trend={loading ? undefined : kpis.bookedTrend}
        />
        <StatsCard
          label="Callback rate"
          value={loading ? "—" : `${kpis.callbackRate}%`}
          subValue={loading ? undefined : kpis.callbackSub}
          trend={loading ? undefined : kpis.callbackTrend}
        />
        <StatsCard
          label="Not booked rate"
          value={loading ? "—" : `${kpis.notBookedRate}%`}
          subValue={loading ? undefined : kpis.notBookedSub}
          trend={loading ? undefined : kpis.notBookedTrend}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AreaLineChart
          key={`${range}-${loading ? "loading" : "ready"}-${dailySeries.length}`}
          title="Daily call volume"
          subtitleRight={loading ? "Loading…" : `Total: ${data?.totalCalls ?? 0}`}
          points={dailySeries}
        />
        <OutcomesDonut
          key={`donut-${range}-${loading ? "loading" : "ready"}-${data?.totalCalls ?? 0}`}
          title="Call outcomes"
          total={data?.totalCalls ?? 0}
          items={[
            {
              label: "Appointment Booked",
              value: data?.outcomes.booked ?? 0,
              color: "rgb(34,197,94)",
            },
            {
              label: "Callback Requested",
              value: data?.outcomes.callback ?? 0,
              color: "rgb(234,179,8)",
            },
            {
              label: "Not Booked",
              value: data?.outcomes.notBooked ?? 0,
              color: "rgb(239,68,68)",
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-surface border border-border rounded-[12px] p-6 flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Peak Hour</span>
          <span className="text-2xl font-semibold text-text-main">{loading ? "—" : data?.peakHour ?? "—"}</span>
        </div>
        <div className="card bg-surface border border-border rounded-[12px] p-6 flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Avg Duration</span>
          <span className="text-2xl font-semibold text-text-main">{loading ? "—" : data?.avgDuration ?? "0:00"}</span>
        </div>
      </div>
    </div>
  );
}
