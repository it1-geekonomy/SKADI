"use client";

import React, { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    booking: true,
    missed: true,
    daily: true,
    weekly: false,
  });

  const toggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 space-y-6 font-geist bg-bg min-h-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-[14px] font-medium text-text-main">Settings</h1>
        <p className="text-[11px] text-text-muted">Agent configuration and account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Configuration */}
        <div className="card bg-surface border border-border rounded-[12px] p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Agent Configuration</h2>
            <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[9px] font-bold border border-accent/30">
              Retell AI
            </span>
          </div>
          
          <div className="space-y-6">
            <SettingRow label="Agent ID" value="agent_a1b2c3d4e5f6" isMono />
            <SettingRow label="Phone Number" value="+1 934 414 6086" isMono />
            <SettingRow label="Voice Model" value="eleven_turbo_v2" isMono />
            <SettingRow label="Language" value="English (IN)" />
          </div>
        </div>

        {/* Notifications */}
        <div className="card bg-surface border border-border rounded-[12px] p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Notifications</h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[9px] font-bold border border-blue-500/20">
              Email Alerts
            </span>
          </div>

          <div className="space-y-6">
            <ToggleRow 
              label="New Booking" 
              active={notifications.booking} 
              onToggle={() => toggle('booking')} 
            />
            <ToggleRow 
              label="No Booking" 
              active={notifications.missed} 
              onToggle={() => toggle('missed')} 
            />
            <ToggleRow 
              label="Daily Summary" 
              active={notifications.daily} 
              onToggle={() => toggle('daily')} 
            />
            <ToggleRow 
              label="Weekly Report" 
              active={notifications.weekly} 
              onToggle={() => toggle('weekly')} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, value, isMono }: { label: string; value: string; isMono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[12px] text-text-dim">{label}</span>
      <span className={`text-[12px] text-text-main ${isMono ? 'font-mono opacity-80' : 'font-medium'}`}>
        {value}
      </span>
    </div>
  );
}

function ToggleRow({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[12px] text-text-dim">{label}</span>
      <button 
        onClick={onToggle}
        className={`w-8 h-4.5 rounded-full transition-all relative ${active ? 'bg-accent' : 'bg-border'}`}
      >
        <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all ${active ? 'left-4' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
