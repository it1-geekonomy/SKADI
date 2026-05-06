"use client";

import React, { useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <div className="flex flex-1 w-full min-h-screen bg-bg">
        {/* Desktop sidebar */}
        <Sidebar
          logo="SKADI"
          sections={sections}
          user={{ name: "Divyasree", role: "Client", initials: "DS" }}
          className="hidden md:flex h-screen sticky top-0"
        />

        {/* Mobile drawer */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/55"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[280px] bg-surface border-r border-border shadow-2xl">
              <Sidebar
                logo="SKADI"
                sections={sections}
                user={{ name: "Divyasree", role: "Client", initials: "DS" }}
                className="w-full h-full"
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </div>
        ) : null}

        <main className="flex-1 flex flex-col min-w-0 bg-bg min-h-screen">
          <Topbar title={getTitle()} onMenuClick={() => setMobileOpen(true)} />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </DashboardThemeRoot>
  );
}
