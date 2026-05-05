"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CallTable } from "@/components/dashboard/CallTable";
import { CallDetailModal } from "@/components/dashboard/CallDetailModal";

const SAMPLE_CALLS: any[] = [
  { 
    id: 'c1', caller: "+91 98765 43210", date: "04 May 2026", time: "10:14", 
    duration: "3m 12s", sentiment: "Positive", to: "+1 934 414 6086", 
    direction: "Inbound", outcome: "Appointment Booked", status: "Completed",
    callId: "call_2c0f154b468d2c2de4f...82d", version: 2, cost: "$0.542",
    tokens: "2702.75", latency: "1616ms", disconnect: "User_hangup",
    summary: "Chetan called to schedule a consultation for renting a 2BHK apartment in JP Nagar. The agent confirmed an appointment with Divyasree for May 18th at 10:00 AM, collected Chetan's contact details, and reassured him that the booking was successful.",
    transcript: [
      { role: "agent", ts: "0:00", text: "Hi there, thank you for calling. This is Skadi, Divyasree's scheduling assistant. May I know your name please?" },
      { role: "user", ts: "0:15", text: "Hi. My name is Chetan." },
      { role: "agent", ts: "0:17", text: "Thank you, Chetan. How can I help you today?" },
    ]
  },
  { caller: "+91 87654 32109", time: "04 May 2026, 09:42", duration: "1m 48s", sentiment: "Neutral", to: "+1 934 414 6086", direction: "Inbound", outcome: "Callback Requested" },
  { caller: "+91 76543 21098", time: "03 May 2026, 16:55", duration: "0m 52s", sentiment: "Negative", to: "+1 934 414 6086", direction: "Inbound", outcome: "No Answer" },
  { caller: "+91 65432 10987", time: "03 May 2026, 14:30", duration: "2m 07s", sentiment: "Positive", to: "+1 934 414 6086", direction: "Inbound", outcome: "Appointment Booked" },
];

export default function AdminOverview() {
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (call: any) => {
    const fullCallData = SAMPLE_CALLS[0].caller === call.caller ? SAMPLE_CALLS[0] : { ...SAMPLE_CALLS[0], ...call };
    setSelectedCall(fullCallData);
    setIsModalOpen(true);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[14px]">
        <StatsCard label="Total Calls" value="247" subValue="+18% vs last month" trend="up" />
        <StatsCard label="Appointments Booked" value="183" subValue="74% booking rate" trend="up" />
        <StatsCard label="Avg Call Duration" value="2:34" subValue="minutes per call" />
        <StatsCard label="Today" value="12" subValue="calls so far" />
      </div>

      <CallTable calls={SAMPLE_CALLS} onRowClick={handleRowClick} />

      <CallDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        call={selectedCall} 
      />
    </div>
  );
}
