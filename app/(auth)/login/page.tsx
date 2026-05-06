"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type LoginTheme = "dark" | "light";
const LOGIN_THEME_KEY = "skadi-login-theme";

export default function LoginPage() {
  const [role, setRole] = useState<"client" | "admin">("admin");
  const [theme, setTheme] = useState<LoginTheme>("dark");
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOGIN_THEME_KEY);
      if (stored === "dark" || stored === "light") {
        setTheme(stored);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = () => {
    const next: LoginTheme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(LOGIN_THEME_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(role === "admin" ? "/admin" : "/client");
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden font-geist ${
        isDark ? "bg-[#07070a]" : "bg-[#f6f7fb]"
      }`}
    >
      {/* Figma-like: clean gradient + subtle noise/grid */}
      {isDark ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(1200px_620px_at_50%_-10%,rgba(124,109,240,0.34),transparent_62%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(980px_560px_at_50%_112%,rgba(255,255,255,0.06),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(820px_520px_at_12%_18%,rgba(124,109,240,0.14),transparent_62%)]" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:84px_84px]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_-10%,rgba(124,109,240,0.22),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_18%_22%,rgba(124,109,240,0.10),transparent_62%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(24,24,27,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(24,24,27,0.08)_1px,transparent_1px)] [background-size:92px_92px]" />
        </>
      )}

      <div className="relative z-10 w-full max-w-[460px] px-6">
        <div
          className={`rounded-[18px] shadow-[0_36px_110px_rgba(0,0,0,0.26)] backdrop-blur-xl ring-1 ${
            isDark
              ? "border border-white/10 bg-[#0f1016]/85 ring-white/5"
              : "border border-black/10 bg-white/80 ring-black/5"
          }`}
        >
          {/* Top accent line */}
          <div className="h-[1px] w-full bg-[linear-gradient(90deg,transparent,rgba(124,109,240,0.8),transparent)]" />

          <div className="p-8 sm:p-9">
          <div className="flex items-center justify-between mb-7">
            <div>
              <div className={`text-[22px] font-semibold tracking-tight ${isDark ? "text-white" : "text-[#0f172a]"}`}>
                Ska<span className="text-accent">di</span>
              </div>
              <div className={`mt-1 text-[12px] ${isDark ? "text-white/60" : "text-slate-600"}`}>
                Sign in to access your dashboard
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`text-[10px] uppercase tracking-[0.12em] ${isDark ? "text-white/50" : "text-slate-500"}`}>
                {role === "admin" ? "Admin" : "Client"}
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className={`p-2 rounded-[10px] border transition-colors ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                    : "bg-black/5 border-black/10 text-slate-600 hover:text-slate-900 hover:bg-black/10"
                }`}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                title={isDark ? "Light mode" : "Dark mode"}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>
          </div>

          {/* Role Toggle */}
          <div
            className={`auth-tabs flex p-1 rounded-[12px] mb-6 border ${
              isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
            }`}
          >
            <button
              type="button"
              onClick={() => setRole("client")}
              className={`auth-tab flex-1 py-2 rounded-[8px] text-[12px] font-semibold transition-all ${
                role === "client"
                  ? isDark
                    ? "bg-white/10 border border-white/10 text-white shadow-sm"
                    : "bg-white border border-black/10 text-slate-900 shadow-sm"
                  : isDark
                    ? "text-white/60 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-black/5"
              }`}
            >
              Client
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`auth-tab flex-1 py-2 rounded-[8px] text-[12px] font-semibold transition-all ${
                role === "admin"
                  ? isDark
                    ? "bg-white/10 border border-white/10 text-white shadow-sm"
                    : "bg-white border border-black/10 text-slate-900 shadow-sm"
                  : isDark
                    ? "text-white/60 hover:text-white hover:bg-white/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-black/5"
              }`}
            >
              Admin
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="auth-field space-y-1.5">
              <label
                className={`text-[11px] font-semibold uppercase tracking-[0.08em] ml-0.5 ${
                  isDark ? "text-white/55" : "text-slate-600"
                }`}
                htmlFor="email"
              >
                Email
              </label>
              <input 
                id="email"
                type="email" 
                defaultValue={role === "admin" ? "admin@skadi.ai" : "divyasree@example.com"}
                className={`w-full rounded-[12px] px-4 py-3 text-[13px] outline-none transition-colors ${
                  isDark
                    ? "bg-black/20 border border-white/10 text-white placeholder:text-white/35 focus:border-accent/70 focus:bg-black/30"
                    : "bg-white border border-black/10 text-slate-900 placeholder:text-slate-400 focus:border-accent/60"
                }`}
              />
            </div>

            <div className="auth-field space-y-1.5">
              <label
                className={`text-[11px] font-semibold uppercase tracking-[0.08em] ml-0.5 ${
                  isDark ? "text-white/55" : "text-slate-600"
                }`}
                htmlFor="password"
              >
                Password
              </label>
              <input 
                id="password"
                type="password" 
                defaultValue="password"
                className={`w-full rounded-[12px] px-4 py-3 text-[13px] outline-none transition-colors ${
                  isDark
                    ? "bg-black/20 border border-white/10 text-white placeholder:text-white/35 focus:border-accent/70 focus:bg-black/30"
                    : "bg-white border border-black/10 text-slate-900 placeholder:text-slate-400 focus:border-accent/60"
                }`}
              />
            </div>

            <button 
              type="submit"
              className="auth-btn w-full bg-accent hover:bg-accent/90 text-white text-[13px] font-semibold py-3 rounded-[12px] transition-colors mt-2 shadow-[0_18px_50px_rgba(124,109,240,0.30)]"
            >
              Sign In
            </button>
          </form>

          <div className={`mt-5 flex items-center justify-between text-[11px] ${isDark ? "text-white/50" : "text-slate-500"}`}>
            <span>Demo credentials</span>
            <span className={`font-mono ${isDark ? "text-white/55" : "text-slate-600"}`}>
              {role === "admin" ? "admin@skadi.ai" : "divyasree@example.com"} · ••••••••
            </span>
          </div>
          </div>
        </div>
      </div>
    </div>
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
