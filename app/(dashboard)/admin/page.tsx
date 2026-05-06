"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CallTable } from "@/components/dashboard/CallTable";
import { CallDetailModal } from "@/components/dashboard/CallDetailModal";

type OverviewStats = {
  totalCalls: number;
  bookedCalls: number;
  bookingRate: number;
  avgDuration: string;
  todayCalls: number;
};

type OverviewRow = {
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

export default function AdminOverview() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [recentCalls, setRecentCalls] = useState<OverviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCall, setSelectedCall] = useState<CallDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/overview?recentLimit=7");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Failed to load overview");
        }
        if (cancelled) return;
        setStats(data.stats ?? null);
        setRecentCalls(data.recentCalls ?? []);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load overview");
        setStats(null);
        setRecentCalls([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRowClick = async (call: OverviewRow) => {
    setDetailLoading(true);
    setIsModalOpen(true);
    setSelectedCall(null);
    setError(null);
    try {
      const res = await fetch(`/api/calls/${encodeURIComponent(call.call_id)}`);
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

  return (
    <div className="p-6 space-y-6 font-geist bg-bg min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[14px] font-medium text-text-main">Skadi AI Voice Agent</h1>
          <p className="text-[11px] text-text-muted mt-0.5">Last 30 days</p>
        </div>
        <Link href="/admin/calls" className="text-[11px] text-text-dim hover:text-text-main transition-colors">
          View All Calls →
        </Link>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] text-red-400">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[14px]">
        <StatsCard
          label="Total Calls"
          value={loading ? "—" : String(stats?.totalCalls ?? 0)}
          subValue="Last 30 days"
        />
        <StatsCard
          label="Appointments Booked"
          value={loading ? "—" : String(stats?.bookedCalls ?? 0)}
          subValue={
            loading ? undefined : `${stats?.bookingRate ?? 0}% booking rate`
          }
          trend="up"
        />
        <StatsCard
          label="Avg Call Duration"
          value={loading ? "—" : stats?.avgDuration ?? "0:00"}
          subValue="minutes per call"
        />
        <StatsCard
          label="Today"
          value={loading ? "—" : String(stats?.todayCalls ?? 0)}
          subValue="calls so far"
        />
      </div>

      {loading ? (
        <div className="p-8 text-center text-[12px] text-text-muted">
          Loading overview…
        </div>
      ) : (
        <CallTable
          calls={recentCalls}
          rangeSubtitle="Last 7 days"
          onRowClick={handleRowClick}
        />
      )}

      {detailLoading && isModalOpen && !selectedCall ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-[12px] text-text-muted">
          Loading call…
        </div>
      ) : null}

      <CallDetailModal 
        isOpen={isModalOpen && Boolean(selectedCall)} 
        onClose={() => setIsModalOpen(false)} 
        call={selectedCall} 
      />
    </div>
  );
}
