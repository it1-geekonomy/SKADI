import React from "react";

interface StatsCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatsCard({ label, value, subValue, trend }: StatsCardProps) {
  return (
    <div className="stat-card bg-surface border border-border p-[18px] rounded-[12px] font-geist">
      <div className="stat-label text-[11px] font-medium text-text-dim uppercase tracking-[0.04em] mb-2.5">{label}</div>
      <div className="stat-value text-[28px] font-semibold text-text-main tracking-[-0.04em] mb-1">{value}</div>
      {subValue && (
        <div className={`stat-sub text-[11px] ${
          trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-text-muted"
        }`}>
          {subValue}
        </div>
      )}
    </div>
  );
}
