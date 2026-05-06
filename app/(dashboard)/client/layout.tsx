"use client";

import React from "react";
import { Sidebar, DashboardIcon, HistoryIcon, TranscriptIcon, AnalyticsIcon, SettingsIcon } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { DashboardThemeRoot } from "@/components/dashboard/DashboardThemeRoot";
import { usePathname } from "next/navigation";

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Map pathname to title
  const getTitle = () => {
    if (pathname.includes("/calls")) return "Call History";
    if (pathname.includes("/transcripts")) return "Transcripts";
    if (pathname.includes("/analytics")) return "Analytics";
    if (pathname.includes("/settings")) return "Settings";
    return "Overview";
  };

  const sections = [
    {
      label: "Dashboard",
      items: [
        { label: "Overview", href: "/client", icon: <DashboardIcon /> },
        { label: "Call History", href: "/client/calls", icon: <HistoryIcon /> },
        { label: "Transcripts", href: "/client/transcripts", icon: <TranscriptIcon /> },
        { label: "Analytics", href: "/client/analytics", icon: <AnalyticsIcon /> },
      ],
    },
    {
      label: "Account",
      items: [
        { label: "Settings", href: "/client/settings", icon: <SettingsIcon /> },
      ],
    },
  ];

  return (
    <DashboardThemeRoot>
      <Sidebar
        logo="SKADI"
        sections={sections}
        user={{ name: "Divyasree", role: "Client", initials: "DS" }}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-bg min-h-screen">
        <Topbar title={getTitle()} />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </DashboardThemeRoot>
  );
}
