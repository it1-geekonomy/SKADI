"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  const router = useRouter();

  const handleSignOut = () => {
    router.push("/login");
  };

  return (
    <header className="h-[52px] flex items-center justify-between px-6 bg-bg border-b border-border sticky top-0 z-40 font-geist">
      <h2 className="text-[14px] font-medium text-text-main">{title}</h2>
      
      <div className="topbar-right flex items-center gap-2">
        <span className="badge badge-live inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[11px] font-medium">
          <span className="dot w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Live
        </span>
        <button 
          onClick={handleSignOut}
          className="btn-sm px-3 py-1 bg-surface-hover border border-border rounded-[8px] text-text-dim text-[11px] hover:text-text-main transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
