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
  recordingUrl: string | null;
}

interface CallDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  call: CallDetail | null;
}

export function CallDetailModal({ isOpen, onClose, call }: CallDetailModalProps) {
  if (!isOpen || !call) return null;

  return (
    <>
      <style>{`
        .cdm-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          background: rgba(0,0,0,0.35);
        }
        .cdm-modal {
          background: #ffffff;
          border-radius: 14px;
          width: 100%;
          max-width: 560px;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 40px rgba(0,0,0,0.18);
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .cdm-header {
          padding: 16px 16px 14px;
          border-bottom: 1px solid #f0f0f0;
          flex-shrink: 0;
        }
        .cdm-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }
        .cdm-title {
          font-size: 14px;
          font-weight: 600;
          color: #111;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        .cdm-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .cdm-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 999px;
          background: #f2f2f2;
          border: 1px solid #e5e5e5;
          font-size: 11px;
          color: #888;
          white-space: nowrap;
        }
        .cdm-pill-val {
          color: #111;
          font-weight: 500;
        }
        .cdm-pill-val.mono {
          font-family: monospace;
          font-size: 10.5px;
        }
        .cdm-close {
          width: 28px;
          height: 28px;
          min-width: 28px;
          border-radius: 50%;
          border: 1px solid #e5e5e5;
          background: #f5f5f5;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #888;
        }
        .cdm-body {
          overflow-y: auto;
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cdm-audio-box {
          background: #f7f7f7;
          border-radius: 10px;
          padding: 10px 14px;
          border: 1px solid #ebebeb;
        }
        .cdm-section-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 10px;
        }

        /* Insight grid — 2 cols on ≥400px, 1 col below */
        .cdm-insights-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }
        @media (min-width: 400px) {
          .cdm-insights-grid {
            grid-template-columns: 1fr 1fr;
          }
          .cdm-insight-full {
            grid-column: 1 / -1;
          }
        }

        .cdm-insight-cell {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 10px 12px;
          background: #f7f7f7;
          border: 1px solid #ebebeb;
          border-radius: 8px;
          min-width: 0;
        }
        .cdm-insight-label {
          font-size: 11px;
          color: #888;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .cdm-insight-value {
          font-size: 12px;
          font-weight: 500;
          color: #111;
          text-align: right;
          white-space: nowrap;
        }
        .cdm-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 10px;
          border-radius: 999px;
          white-space: nowrap;
        }
        .cdm-summary-box {
          background: #f9f9f9;
          border: 1px solid #ebebeb;
          border-radius: 10px;
          padding: 14px 16px;
        }
        .cdm-summary-text {
          font-size: 13px;
          color: #555;
          line-height: 1.6;
          margin: 0;
        }
      `}</style>

      <div className="cdm-modal-overlay">
        <div className="cdm-modal">

          {/* Header */}
          <div className="cdm-header">
            <div className="cdm-header-row">
              <div style={{ minWidth: 0 }}>
                <div className="cdm-title">
                  {call.date} · {call.time} · {call.direction}
                </div>
                <div className="cdm-pills">
                  <span className="cdm-pill">
                    Duration <span className="cdm-pill-val mono">{call.duration}</span>
                  </span>
                  <span className="cdm-pill">
                    Outcome <span className="cdm-pill-val">{call.outcome}</span>
                  </span>
                  <span className="cdm-pill">
                    From <span className="cdm-pill-val mono">{call.caller}</span>
                  </span>
                  <span className="cdm-pill">
                    To <span className="cdm-pill-val mono">{call.to}</span>
                  </span>
                </div>
              </div>
              <button className="cdm-close" onClick={onClose}>✕</button>
            </div>
          </div>

          {/* Body */}
          <div className="cdm-body">

            {/* Audio */}
            <div className="cdm-audio-box">
              {call.recordingUrl ? (
                <audio
                  key={call.recordingUrl}
                  controls
                  preload="metadata"
                  style={{ width: "100%", height: "36px" }}
                  src={call.recordingUrl}
                >
                  Your browser does not support audio playback.
                </audio>
              ) : (
                <p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>
                  No recording available.
                </p>
              )}
            </div>

            {/* Insights */}
            <div>
              <div className="cdm-section-label">Call Insights</div>
              <div className="cdm-insights-grid">

                <div className="cdm-insight-cell">
                  <span className="cdm-insight-label">Call result</span>
                  <span
                    className="cdm-badge"
                    style={
                      call.status === "Completed"
                        ? { background: "#e6faf0", color: "#16a34a" }
                        : { background: "#fef2f2", color: "#dc2626" }
                    }
                  >
                    {call.status === "Completed" ? "Successful" : "Unsuccessful"}
                  </span>
                </div>

                <div className="cdm-insight-cell">
                  <span className="cdm-insight-label">Call status</span>
                  <span className="cdm-insight-value">{call.callStatusLabel}</span>
                </div>

                <div className="cdm-insight-cell">
                  <span className="cdm-insight-label">User sentiment</span>
                  <span
                    className="cdm-badge"
                    style={
                      call.sentiment === "Positive"
                        ? { background: "#e6faf0", color: "#16a34a" }
                        : call.sentiment === "Neutral"
                          ? { background: "#fefce8", color: "#ca8a04" }
                          : { background: "#fef2f2", color: "#dc2626" }
                    }
                  >
                    {call.sentiment}
                  </span>
                </div>

                <div className="cdm-insight-cell">
                  <span className="cdm-insight-label">Disconnection</span>
                  <span className="cdm-insight-value">{call.disconnect}</span>
                </div>

                <div className="cdm-insight-cell cdm-insight-full">
                  <span className="cdm-insight-label">End-to-end latency</span>
                  <span className="cdm-insight-value">{call.latency}</span>
                </div>

              </div>
            </div>

            {/* Summary */}
            <div className="cdm-summary-box">
              <div className="cdm-section-label">Summary</div>
              <p className="cdm-summary-text">{call.summary}</p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}