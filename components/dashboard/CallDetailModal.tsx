"use client";

import React from "react";

interface TranscriptMessage {
  role: "agent" | "user";
  ts: string;
  text: string;
}

interface CallDetail {
  id: string;
  caller: string;
  date: string;
  time: string;
  duration: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  to: string;
  direction: string;
  outcome: string;
  status: string;
  callId: string;
  version: number;
  cost: string;
  tokens: string;
  latency: string;
  disconnect: string;
  summary: string;
  transcript: TranscriptMessage[];
}

interface CallDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  call: CallDetail | null;
}

export function CallDetailModal({ isOpen, onClose, call }: CallDetailModalProps) {
  if (!isOpen || !call) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity font-geist">
      <div className="bg-surface border border-border rounded-[12px] w-full max-w-[680px] max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-fade-up">
        
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border bg-surface">
          <div>
            <div className="text-[15px] font-semibold text-text-main">
              {call.date} {call.time} {call.direction.toLowerCase()}_call
            </div>
            <div className="text-[11px] text-text-muted mt-1 leading-relaxed">
              Agent: Skadi (agent_dc2fab...902) · Version: {call.version} · Call ID: {call.callId} · Duration: {call.duration} · Cost: {call.cost} · LLM Token: {call.tokens}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-[26px] h-[26px] rounded-md bg-surface-hover border border-border flex items-center justify-center text-text-dim hover:text-text-main hover:bg-surface3 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="modal-body overflow-y-auto p-5 space-y-6 flex-1 bg-bg/30">
          
          {/* Audio Player Placeholder */}
          <div className="bg-surface-hover border border-border rounded-[8px] p-3 flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white flex-shrink-0">
              ▶
            </button>
            <div className="flex-1 space-y-1.5 pr-2">
              <div className="h-[3px] bg-surface2 border border-border rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[30%]" />
              </div>
              <div className="flex items-center justify-between text-[9px] text-text-muted font-mono">
                <span>0:00</span>
                <span>{call.duration}</span>
              </div>
            </div>
          </div>

          {/* Analysis Grid */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">Conversation Analysis</h4>
            <div className="grid grid-cols-2 gap-2.5">
              <AnalysisRow label="✅ Call Successful" value={call.status === "Completed" ? "Successful" : "Failed"} isBadge badgeColor="bg-green-500/10 text-green-500" />
              <AnalysisRow label="📞 Call Status" value="Ended" />
              <AnalysisRow label="💬 User Sentiment" value={call.sentiment} isBadge badgeColor={call.sentiment === "Positive" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"} />
              <AnalysisRow label="📴 Disconnection" value={call.disconnect} />
              <AnalysisRow label="⚡ End to End Latency" value={call.latency} isFullWidth />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-surface-hover border border-border rounded-[8px] p-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted mb-2">Summary</h4>
            <p className="text-[12px] text-text-dim leading-relaxed">{call.summary}</p>
          </div>

          {/* Transcript Tabs */}
          <div className="space-y-4">
            <div className="flex gap-4 border-b border-border">
              <button className="px-1 py-2 text-[12px] font-medium text-text-main border-b-2 border-accent -mb-[1px]">Transcription</button>
              <button className="px-1 py-2 text-[12px] font-medium text-text-muted hover:text-text-main transition-colors">Data</button>
              <button className="px-1 py-2 text-[12px] font-medium text-text-muted hover:text-text-main transition-colors">Detail Logs</button>
            </div>
            
            <div className="space-y-4">
              {call.transcript.map((m, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center px-1">
                    <span className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${m.role === "agent" ? "text-accent" : "text-text-muted"}`}>
                      {m.role === "agent" ? "Agent" : "User"}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted">{m.ts}</span>
                  </div>
                  <div className={`p-3 rounded-lg text-[12px] leading-relaxed max-w-[90%] ${
                    m.role === "agent" ? "bg-accent-glow border border-accent/20 text-text-main" : "bg-surface-hover border border-border text-text-dim"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisRow({ label, value, isBadge, badgeColor, isFullWidth }: { label: string; value: string; isBadge?: boolean; badgeColor?: string; isFullWidth?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-2.5 bg-surface-hover border border-border rounded-[8px] ${isFullWidth ? "col-span-2" : ""}`}>
      <span className="text-[11px] text-text-dim flex items-center gap-1.5">{label}</span>
      {isBadge ? (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${badgeColor}`}>
          {value}
        </span>
      ) : (
        <span className="text-[12px] font-medium text-text-main">{value}</span>
      )}
    </div>
  );
}
