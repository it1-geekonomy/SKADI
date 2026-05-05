"use client";

import React, { useState } from "react";
import { CallTable } from "@/components/dashboard/CallTable";
import { CallDetailModal } from "@/components/dashboard/CallDetailModal";

const FULL_CALL_HISTORY: any[] = [
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
];

export default function CallsPage() {
  const [filter, setFilter] = useState("all");
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (call: any) => {
    const fullCallData = FULL_CALL_HISTORY[0].caller === call.caller ? FULL_CALL_HISTORY[0] : { ...FULL_CALL_HISTORY[0], ...call };
    setSelectedCall(fullCallData);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 font-geist bg-bg min-h-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-[14px] font-medium text-text-main">Call History</h1>
        <p className="text-[11px] text-text-muted">All inbound calls handled by Skadi</p>
      </div>

      <div className="card bg-surface border border-border rounded-[12px] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-1.5">
            <FilterButton label="All Outcomes" active={filter === "all"} onClick={() => setFilter("all")} />
            <FilterButton label="Booked" active={filter === "booked"} onClick={() => setFilter("booked")} />
            <FilterButton label="Callback" active={filter === "callback"} onClick={() => setFilter("callback")} />
            <FilterButton label="Missed" active={filter === "missed"} onClick={() => setFilter("missed")} />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 border-r border-border pr-4">
              <FilterButton label="Last 30 Days" active={true} />
              <FilterButton label="Last 7 Days" />
              <FilterButton label="Today" />
            </div>
            <button className="px-3 py-1 bg-accent text-white text-[12px] font-medium rounded-lg hover:bg-accent/90 transition-colors">
              Export CSV
            </button>
          </div>
        </div>
        
        <CallTable calls={FULL_CALL_HISTORY} onRowClick={handleRowClick} />
      </div>

      <CallDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        call={selectedCall} 
      />
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button 
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
