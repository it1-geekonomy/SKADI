"use client";

import React from "react";

export default function AnalyticsPage() {
  const outcomes = [
    { label: "Appointment Booked", percentage: 74, color: "bg-green-500" },
    { label: "Callback Requested", percentage: 14, color: "bg-yellow-500" },
    { label: "No Answer / Missed", percentage: 8, color: "bg-red-500" },
    { label: "Voicemail Left", percentage: 4, color: "bg-text-muted" },
  ];

  const dailyVolume = [40, 60, 30, 80, 50, 90, 75, 45, 65, 85];

  return (
    <div className="p-6 space-y-6 font-geist bg-bg min-h-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[14px] font-medium text-text-main">Analytics</h1>
          <p className="text-[11px] text-text-muted">Performance Insights — Last 30 days</p>
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-surface border border-border rounded-lg">
          <button className="px-3 py-1 rounded-md text-[11px] font-medium transition-colors bg-accent/20 text-accent border border-accent/30">
            Last 30 Days
          </button>
          <button className="px-3 py-1 rounded-md text-[11px] font-medium transition-colors text-text-dim hover:bg-surface-hover">
            Last 7 Days
          </button>
          <button className="px-3 py-1 rounded-md text-[11px] font-medium transition-colors text-text-dim hover:bg-surface-hover">
            This Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Call Volume Chart */}
        <div className="lg:col-span-2 card bg-surface border border-border rounded-[12px] p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[12px] font-semibold uppercase tracking-wider text-text-muted">Daily Call Volume</h2>
            <span className="text-[11px] text-text-muted">April, 2026</span>
          </div>
          <div className="h-[200px] flex items-end justify-between gap-2">
            {dailyVolume.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-accent/80 rounded-t-sm group-hover:bg-accent transition-all duration-300" 
                  style={{ height: `${val}%` }}
                ></div>
                <span className="text-[9px] text-text-muted font-medium">{i * 3 + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call Outcomes List */}
        <div className="card bg-surface border border-border rounded-[12px] p-6">
          <h2 className="text-[12px] font-semibold uppercase tracking-wider text-text-muted mb-8">Call Outcomes</h2>
          <div className="space-y-6">
            {outcomes.map((outcome, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-medium">
                  <span className="text-text-dim">{outcome.label}</span>
                  <span className="text-text-main">{outcome.percentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${outcome.color} rounded-full`} 
                    style={{ width: `${outcome.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-surface border border-border rounded-[12px] p-6 flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Peak Hour</span>
          <span className="text-2xl font-semibold text-text-main">10 AM</span>
        </div>
        <div className="card bg-surface border border-border rounded-[12px] p-6 flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-2">Avg Duration</span>
          <span className="text-2xl font-semibold text-text-main">2:34</span>
        </div>
      </div>
    </div>
  );
}
