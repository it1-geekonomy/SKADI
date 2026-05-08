import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  logo: string;
  logoSrc?: string;
  homeHref?: string;
  sections: {
    label: string;
    items: NavItem[];
  }[];
  user: {
    name: string;
    role: string;
    initials: string;
  };
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({
  logo,
  logoSrc,
  homeHref,
  sections,
  user,
  className,
  onNavigate,
}: SidebarProps) {
  const logoHref = homeHref ?? "/";
  const src = logoSrc ?? "/Skadi Logo Final.png";
  return (
    <aside
      className={[
        "w-[220px] flex-shrink-0 bg-surface border-r border-border flex flex-col font-geist",
        className ?? "h-screen sticky top-0",
      ].join(" ")}
    >
      <div className="px-2 py-2 border-b border-border">
        <Link href={logoHref} className="flex items-center w-full" onClick={onNavigate}>
          <div className="relative w-full max-w-[200px] mx-auto h-[60px] overflow-hidden rounded-[5px]">
            <Image
              src={src}
              alt={logo || "Skadi"}
              fill
              priority
              sizes="180px"
              className="object-cover object-center"
            />
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-7 px-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted mb-3 px-3">
              {section.label}
            </h3>
            <nav className="space-y-1.5">
              {section.items.map((item, itemIdx) => (
                <SidebarNavItem key={itemIdx} {...item} onNavigate={onNavigate} />
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 px-1">
          <div className="w-[32px] h-[32px] rounded-full bg-accent flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-text-main truncate leading-tight">{user.name}</p>
            <p className="text-[11px] text-text-muted leading-tight">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarNavItem({
  label,
  href,
  icon,
  onNavigate,
}: NavItem & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 px-3 py-2 rounded-[10px] transition-all text-[13px] ${
        isActive
          ? "bg-accent/10 border border-accent/30 text-accent font-semibold"
          : "text-text-dim hover:bg-surface-hover hover:text-text-main border border-transparent font-medium"
      }`}
    >
      <span className={`w-4 h-4 flex items-center justify-center flex-shrink-0 ${isActive ? "text-accent" : "text-text-muted"}`}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </Link>
  );
}

// Icons matching the line-art style of the mockup
export const DashboardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

export const HistoryIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);

export const TranscriptIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="15" y2="18" />
  </svg>
);

export const AnalyticsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
  </svg>
);

export const UsersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const SettingsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
