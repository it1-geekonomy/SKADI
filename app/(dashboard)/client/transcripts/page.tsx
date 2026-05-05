"use client";

import React, { useState } from "react";
import { CallTable } from "@/components/dashboard/CallTable";
import { CallDetailModal } from "@/components/dashboard/CallDetailModal";

const TRANSCRIPT_LOGS: any[] = [
  { 
    id: 't1', caller: "+91 98765 43210", date: "04 May 2026", time: "10:14", 
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
];

export default function TranscriptsPage() {
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (call: any) => {
    const fullCallData = TRANSCRIPT_LOGS[0].caller === call.caller ? TRANSCRIPT_LOGS[0] : { ...TRANSCRIPT_LOGS[0], ...call };
    setSelectedCall(fullCallData);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 font-geist bg-bg min-h-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-[14px] font-medium text-text-main">Transcripts</h1>
        <p className="text-[11px] text-text-muted">Full conversation logs from every call</p>
      </div>

      <div className="card bg-surface border border-border rounded-[12px] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1 rounded-full text-[11px] font-medium transition-colors bg-accent/20 text-accent border border-accent/30">
              All Calls
            </button>
            <button className="px-3 py-1 rounded-full text-[11px] font-medium transition-colors text-text-dim hover:bg-surface-hover border border-transparent">
              Booked
            </button>
            <button className="px-3 py-1 rounded-full text-[11px] font-medium transition-colors text-text-dim hover:bg-surface-hover border border-transparent">
              Callback
            </button>
            <button className="px-3 py-1 rounded-full text-[11px] font-medium transition-colors text-text-dim hover:bg-surface-hover border border-transparent">
              Missed
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="px-3 py-1 bg-accent text-white text-[12px] font-medium rounded-lg hover:bg-accent/90 transition-colors">
              Export CSV
            </button>
          </div>
        </div>
        
        <CallTable calls={TRANSCRIPT_LOGS} onRowClick={handleRowClick} />
      </div>

      <CallDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        call={selectedCall} 
      />
    </div>
  );
}
