"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import NavbarWrapper from "@/components/NavbarWrapper";

const DASHBOARD_PATHS = ["/admin", "/client", "/login"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideWebsiteChrome = DASHBOARD_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (hideWebsiteChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <NavbarWrapper />
      {children}
      <Footer />
    </>
  );
}
