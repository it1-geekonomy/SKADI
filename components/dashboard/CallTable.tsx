import React from "react";

interface Call {
  call_id: string;
  caller: string;
  time: string;
  duration: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  to: string;
  direction: "Inbound" | "Outbound";
  outcome: string;
}

interface CallTableProps {
  calls: Call[];
  rangeSubtitle?: string;
  onRowClick?: (call: Call) => void;
  startIndex?: number;
}

export function CallTable({
  calls,
  rangeSubtitle = "Last 7 days",
  onRowClick,
  startIndex = 0,
}: CallTableProps) {
  return (
    <div className="card bg-surface border border-border rounded-[12px] overflow-hidden font-geist">
      <div className="card-header flex items-center justify-between p-4 border-b border-border">
        <div>
          <div className="card-title text-[13px] font-medium text-text-main">Recent Calls</div>
          <div className="card-sub text-[11px] text-text-muted mt-0.5">{rangeSubtitle}</div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted border-b border-border whitespace-nowrap w-[64px]">
                S no
              </th>
              <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted border-b border-border whitespace-nowrap">Caller</th>
              <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted border-b border-border whitespace-nowrap">Time</th>
              <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted border-b border-border whitespace-nowrap">Duration</th>
              <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted border-b border-border whitespace-nowrap">Sentiment</th>
              <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted border-b border-border whitespace-nowrap">To</th>
              <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted border-b border-border whitespace-nowrap">Direction</th>
              <th className="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted border-b border-border whitespace-nowrap">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call, idx) => (
              <tr 
                key={call.call_id} 
                onClick={() => onRowClick?.(call)}
                className="group border-b border-border last:border-0 hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <td className="px-5 py-3 text-[12px] text-text-dim whitespace-nowrap tabular-nums">
                  {startIndex + idx + 1}
                </td>
                <td className="px-5 py-3 text-[12px] text-text-main whitespace-nowrap">{call.caller}</td>
                <td className="px-5 py-3 text-[12px] text-text-dim whitespace-nowrap">{call.time}</td>
                <td className="px-5 py-3 text-[12px] text-text-main whitespace-nowrap">{call.duration}</td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <SentimentBadge sentiment={call.sentiment} />
                </td>
                <td className="px-5 py-3 text-[11px] text-text-dim whitespace-nowrap">{call.to}</td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <DirectionBadge direction={call.direction} />
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <OutcomeBadge outcome={call.outcome} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SentimentBadge({ sentiment }: { sentiment: Call["sentiment"] }) {
  const colors = {
    Positive: "bg-green-500/10 text-green-500",
    Neutral: "bg-yellow-500/10 text-yellow-500",
    Negative: "bg-red-500/10 text-red-500",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${colors[sentiment]}`}>
      <span className="dot w-1 h-1 rounded-full bg-current" />
      {sentiment}
    </span>
  );
}

function DirectionBadge({ direction }: { direction: Call["direction"] }) {
  const colors = {
    Inbound: "bg-accent/10 text-accent",
    Outbound: "bg-accent/10 text-accent",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${colors[direction]}`}>
      {direction === "Inbound" ? "↙" : "↗"} {direction}
    </span>
  );
}

function OutcomeBadge({ outcome }: { outcome: string }) {
  const isBooked = outcome === "Appointment Booked";
  const isCallback = outcome === "Callback Requested";
  const isNotBooked = outcome === "Not Booked";

  const color = isBooked
    ? "bg-green-500/10 text-green-600 border border-green-500/20"
    : isCallback
      ? "bg-yellow-500/10 text-yellow-700 border border-yellow-500/20"
      : isNotBooked
        ? "bg-slate-500/10 text-slate-600 border border-slate-500/20"
        : "bg-slate-500/10 text-slate-600 border border-slate-500/20";
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${color}`}>
      {outcome}
    </span>
  );
}
