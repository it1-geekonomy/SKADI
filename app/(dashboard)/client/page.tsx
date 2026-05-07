"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CallTable } from "@/components/dashboard/CallTable";
import { CallDetailModal } from "@/components/dashboard/CallDetailModal";
import { useGetOverviewQuery } from "@/lib/store/endpoints/overviewApi";
import { useGetCallByIdQuery } from "@/lib/store/endpoints/callsApi";

type CallDetail = React.ComponentProps<typeof CallDetailModal>["call"];

export default function ClientOverview() {
  const {
    data: overview,
    isLoading: loading,
    error,
  } = useGetOverviewQuery({ recentLimit: 7 });

  const stats = overview?.stats ?? null;
  const recentCalls = overview?.recentCalls ?? [];

  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: detailData,
    isFetching: detailLoading,
    error: detailError,
  } = useGetCallByIdQuery(activeCallId ?? "", { skip: !activeCallId });

  const selectedCall: CallDetail | null = detailData?.call ?? null;

  const handleRowClick = (call: { call_id: string }) => {
    setActiveCallId(call.call_id);
    setIsModalOpen(true);
  };

  const errorMessage = error
    ? "Failed to load overview"
    : detailError
      ? "Failed to load call"
      : null;

  return (
    <div className="p-6 space-y-6 font-geist bg-bg min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[14px] font-medium text-text-main">Skadi AI Voice Agent</h1>
          <p className="text-[11px] text-text-muted mt-0.5">Last 30 days</p>
        </div>
        <Link href="/client/calls" className="text-[11px] text-text-dim hover:text-text-main transition-colors">
          View All Calls →
        </Link>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-[12px] text-red-400">
          {errorMessage}
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
