"use client";

import React, { useCallback, useEffect, useState } from "react";

import {
  DashboardThemeContext,
  type DashboardTheme,
} from "@/components/dashboard/dashboard-theme-context";

const STORAGE_KEY = "skadi-dashboard-theme";

export function DashboardThemeRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<DashboardTheme>("dark");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        setThemeState(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = useCallback((t: DashboardTheme) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <DashboardThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div
        className="flex min-h-screen w-full bg-bg"
        data-dashboard-theme={theme}
      >
        {children}
      </div>
    </DashboardThemeContext.Provider>
  );
}
