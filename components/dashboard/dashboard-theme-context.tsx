"use client";

import { createContext, useContext } from "react";

export type DashboardTheme = "dark" | "light";

export type DashboardThemeContextValue = {
  theme: DashboardTheme;
  setTheme: (t: DashboardTheme) => void;
  toggleTheme: () => void;
};

export const DashboardThemeContext =
  createContext<DashboardThemeContextValue | null>(null);

export function useDashboardTheme(): DashboardThemeContextValue {
  const ctx = useContext(DashboardThemeContext);
  if (!ctx) {
    throw new Error(
      "useDashboardTheme must be used within DashboardThemeRoot"
    );
  }
  return ctx;
}
