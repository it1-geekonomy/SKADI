"use client";

import React from "react";
import { Sidebar, DashboardIcon, HistoryIcon, TranscriptIcon, AnalyticsIcon, SettingsIcon, UsersIcon } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { usePathname } from "next/navigation";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
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
    <div className="flex min-h-screen bg-bg">
      <Sidebar 
        logo="SKADI" 
        sections={sections} 
        user={{ name: "Admin", role: "Administrator", initials: "AD" }} 
      />
      
      <main className="flex-1 flex flex-col min-w-0 bg-bg">
        <Topbar title={getTitle()} />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
