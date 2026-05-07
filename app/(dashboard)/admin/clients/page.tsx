"use client";

import React from "react";

const CLIENTS = [
  { name: "Divyasree", type: "Interior Consulting", initials: "DS", color: "#214433", status: "Active", calls: 247, bookRate: "74%", bookings: 183, duration: "2:34" },
  { name: "TechCorp India", type: "IT Services", initials: "TC", color: "#3b82f6", status: "Active", calls: 512, bookRate: "61%", bookings: 312, duration: "1:58" },
  { name: "Meera Clinics", type: "Healthcare", initials: "MC", color: "#22c55e", status: "Setup", calls: 89, bookRate: "82%", bookings: 73, duration: "3:12" },
];

export default function ClientsPage() {
  return (
    <div className="p-6 space-y-6 font-geist bg-bg min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[14px] font-medium text-text-main">Clients</h1>
          <p className="text-[11px] text-text-muted mt-0.5">All active and inactive Skadi deployments</p>
        </div>
        <button className="px-3 py-1.5 bg-accent text-white text-[12px] font-medium rounded-lg hover:bg-accent/90 transition-colors">
          + Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CLIENTS.map((client, idx) => (
          <div key={idx} className="card bg-surface border border-border p-5 rounded-[12px]">
            <div className="flex items-center gap-3 mb-5">
              <div 
                className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[14px] font-semibold text-white"
                style={{ backgroundColor: client.color }}
              >
                {client.initials}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-medium text-text-main">{client.name}</div>
                <div className="text-[11px] text-text-muted">{client.type}</div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                client.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
              }`}>
                {client.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <StatItem label="Total Calls" value={client.calls} />
              <StatItem label="Book Rate" value={client.bookRate} />
              <StatItem label="Bookings" value={client.bookings} />
              <StatItem label="Avg Duration" value={client.duration} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-[16px] font-semibold text-text-main tracking-tight">{value}</div>
      <div className="text-[10px] text-text-muted uppercase tracking-[0.04em]">{label}</div>
    </div>
  );
}

