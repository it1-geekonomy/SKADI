"use client";

import React, { useState } from "react";
import { Sidebar, DashboardIcon, HistoryIcon, TranscriptIcon, AnalyticsIcon, SettingsIcon, UsersIcon } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { DashboardThemeRoot } from "@/components/dashboard/DashboardThemeRoot";
import { usePathname } from "next/navigation";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const getTitle = () => {
    if (pathname.includes("/clients")) return "Clients Management";
    if (pathname.includes("/settings")) return "System Settings";
    return "Admin Overview";
  };

  const sections = [
    {
      label: "Dashboard",
      items: [
        { label: "Overview", href: "/admin", icon: <DashboardIcon /> },
        { label: "Call History", href: "/admin/calls", icon: <HistoryIcon /> },
        { label: "Transcripts", href: "/admin/transcripts", icon: <TranscriptIcon /> },
        { label: "Analytics", href: "/admin/analytics", icon: <AnalyticsIcon /> },
      ],
    },
    {
      label: "Admin",
      items: [
        { label: "Clients", href: "/admin/clients", icon: <UsersIcon /> },
      ],
    },
    {
      label: "Account",
      items: [
        { label: "Settings", href: "/admin/settings", icon: <SettingsIcon /> },
      ],
    },
  ];

  return (
    <DashboardThemeRoot>
      <div className="flex min-h-screen bg-bg">
        {/* Desktop sidebar */}
        <Sidebar
          logo="SKADI"
          sections={sections}
          user={{ name: "Admin", role: "Administrator", initials: "AD" }}
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
                user={{ name: "Admin", role: "Administrator", initials: "AD" }}
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
