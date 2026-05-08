"use client";

import React, { useMemo, useState } from "react";

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
  /** From Retell call_status */
  callStatusLabel: string;
  callId: string;
  version: number;
  cost: string;
  tokens: string;
  latency: string;
  disconnect: string;
  summary: string;
  transcript: TranscriptMessage[];
  agentLine: string;
  /** Retell recording URL when available */
  recordingUrl: string | null;
}

interface CallDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  call: CallDetail | null;
}

export function CallDetailModal({ isOpen, onClose, call }: CallDetailModalProps) {
  if (!isOpen || !call) return null;

  const [tab, setTab] = useState<"transcript" | "data">("transcript");
  const agentName = useMemo(() => {
    // agentLine looks like: "Skadi (agent_...) · Version: 1"
    return call.agentLine.split(" (")[0] || "Agent";
  }, [call.agentLine]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity font-geist">
      <div className="bg-surface border border-border rounded-[12px] w-full max-w-[680px] max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-fade-up">
        
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border bg-surface">
          <div>
            <div className="text-[15px] font-semibold text-text-main">
              {call.date} · {call.time} · {call.direction}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <InfoPill label="Duration" value={call.duration} mono />
              <InfoPill label="Outcome" value={call.outcome} />
              <InfoPill label="From" value={call.caller} mono />
              <InfoPill label="To" value={call.to} mono />
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
          
          <div className="bg-surface-hover border border-border rounded-[8px] p-3">
            {call.recordingUrl ? (
              <audio
                key={call.recordingUrl}
                controls
                preload="metadata"
                className="w-full h-10"
                src={call.recordingUrl}
              >
                Your browser does not support audio playback.
              </audio>
            ) : (
              <p className="text-[11px] text-text-muted leading-relaxed">
                No recording URL in this call payload. In Retell, recordings appear after the call ends and when storage/recording is enabled for the agent.
              </p>
            )}
          </div>

          {/* Insights */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Call insights
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <AnalysisRow
                label="Call result"
                value={call.status === "Completed" ? "Successful" : "Unsuccessful"}
                isBadge
                badgeColor={
                  call.status === "Completed"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }
              />
              <AnalysisRow label="Call status" value={call.callStatusLabel} />
              <AnalysisRow
                label="User sentiment"
                value={call.sentiment}
                isBadge
                badgeColor={
                  call.sentiment === "Positive"
                    ? "bg-green-500/10 text-green-500"
                    : call.sentiment === "Neutral"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-red-500/10 text-red-500"
                }
              />
              <AnalysisRow label="Disconnection" value={call.disconnect} />
              <AnalysisRow label="End-to-end latency" value={call.latency} isFullWidth />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-surface-hover border border-border rounded-[8px] p-4">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted mb-2">Summary</h4>
            <p className="text-[12px] text-text-dim leading-relaxed">{call.summary}</p>
          </div>

          {/* Tabs */}
          <div className="space-y-4">
            <div className="flex gap-4 border-b border-border">
              <TabButton
                active={tab === "transcript"}
                onClick={() => setTab("transcript")}
              >
                Transcription
              </TabButton>
              <TabButton active={tab === "data"} onClick={() => setTab("data")}>
                Data
              </TabButton>
            </div>
            
            {tab === "transcript" ? (
              <div className="space-y-4">
                {call.transcript.length === 0 ? (
                  <div className="text-[12px] text-text-muted">
                    No transcript in this payload.
                  </div>
                ) : (
                  call.transcript.map((m, idx) => (
                    <ChatBubble
                      key={idx}
                      side={m.role === "agent" ? "right" : "left"}
                      ts={m.ts}
                      text={m.text}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <KeyValue label="Agent" value={agentName} />
                <KeyValue
                  label="Call ID"
                  value={call.id}
                  mono
                  onCopy={() => void navigator.clipboard.writeText(call.id)}
                />
                <KeyValue label="From" value={call.caller} mono />
                <KeyValue label="To" value={call.to} mono />
                <KeyValue label="Outcome" value={call.outcome} />
                <KeyValue label="Duration" value={call.duration} mono />
                <KeyValue label="Tokens" value={call.tokens} mono />
                <KeyValue label="Latency" value={call.latency} mono />
                <KeyValue label="Status" value={call.callStatusLabel} />
                <KeyValue label="Disconnection" value={call.disconnect} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-1 py-2 text-[12px] font-medium -mb-[1px] border-b-2 ${
        active
          ? "text-text-main border-accent"
          : "text-text-muted border-transparent hover:text-text-main"
      } transition-colors`}
    >
      {children}
    </button>
  );
}

function InfoPill({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-hover border border-border text-[11px] text-text-dim">
      <span className="text-text-muted">{label}</span>
      <span className={mono ? "font-mono text-text-main" : "text-text-main"}>
        {value}
      </span>
    </span>
  );
}

function KeyValue({
  label,
  value,
  mono,
  onCopy,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-2.5 bg-surface-hover border border-border rounded-[8px]">
      <span className="text-[11px] text-text-dim">{label}</span>
      <span className="flex items-center gap-2">
        <span
          className={`text-[12px] font-medium text-text-main ${
            mono ? "font-mono" : ""
          }`}
        >
          {value}
        </span>
        {onCopy ? (
          <button
            type="button"
            onClick={onCopy}
            className="text-[11px] px-2 py-1 rounded-md border border-border bg-surface text-text-dim hover:text-text-main hover:bg-surface3 transition-colors"
          >
            Copy
          </button>
        ) : null}
      </span>
    </div>
  );
}

function ChatBubble({
  side,
  ts,
  text,
}: {
  side: "left" | "right";
  ts: string;
  text: string;
}) {
  const isRight = side === "right";
  const speakerLabel = isRight ? "Agent" : "User";
  return (
    <div className={`flex ${isRight ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[78%] min-w-[120px]">
        <div
          className={`px-1 mb-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${
            isRight ? "text-accent text-right" : "text-text-muted text-left"
          }`}
        >
          {speakerLabel}
        </div>
        <div
          className={`px-3 py-2.5 rounded-2xl text-[12px] leading-relaxed border shadow-sm ${
            isRight
              ? "bg-accent-glow border-accent/30 text-text-main"
              : "bg-surface-hover border-border text-text-main"
          }`}
          style={{
            borderTopRightRadius: isRight ? 6 : undefined,
            borderTopLeftRadius: !isRight ? 6 : undefined,
          }}
        >
          {text}
        </div>
        <div
          className={`mt-1 text-[10px] text-text-muted font-mono ${
            isRight ? "text-right" : "text-left"
          }`}
        >
          {ts}
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
