"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { useDashboardTheme } from "@/components/dashboard/dashboard-theme-context";

interface TopbarProps {
  title: string;
  onMenuClick?: () => void;
}

export function Topbar({ title, onMenuClick }: TopbarProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useDashboardTheme();

  const handleSignOut = () => {
    router.push("/login");
  };

  return (
    <header className="h-[52px] flex items-center justify-between px-4 sm:px-6 bg-bg border-b border-border sticky top-0 z-40 font-geist">
      <div className="flex items-center gap-2 min-w-0">
        {onMenuClick ? (
          <button
            type="button"
            onClick={onMenuClick}
            className="md:hidden btn-sm p-2 rounded-[8px] bg-surface-hover border border-border text-text-dim hover:text-text-main transition-colors"
            aria-label="Open menu"
            title="Menu"
          >
            <MenuIcon />
          </button>
        ) : null}
        <h2 className="text-[14px] font-medium text-text-main truncate">{title}</h2>
      </div>
      
      <div className="topbar-right flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="btn-sm p-2 rounded-[8px] bg-surface-hover border border-border text-text-dim hover:text-text-main transition-colors"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        {/* <span className="badge badge-live inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-[11px] font-medium">
          <span className="dot w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Live
        </span> */}
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

function MenuIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
