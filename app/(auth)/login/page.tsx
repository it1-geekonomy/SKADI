"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [role, setRole] = useState<"client" | "admin">("client");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(role === "admin" ? "/admin" : "/client");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#07070a] relative overflow-hidden font-geist">
      {/* Figma-like: clean gradient + subtle noise/grid */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_620px_at_50%_-10%,rgba(124,109,240,0.34),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(980px_560px_at_50%_112%,rgba(255,255,255,0.06),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(820px_520px_at_12%_18%,rgba(124,109,240,0.14),transparent_62%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:84px_84px]" />

      <div className="relative z-10 w-full max-w-[460px] px-6">
        <div className="rounded-[18px] border border-white/10 bg-[#0f1016]/85 shadow-[0_36px_110px_rgba(0,0,0,0.78)] backdrop-blur-xl ring-1 ring-white/5">
          {/* Top accent line */}
          <div className="h-[1px] w-full bg-[linear-gradient(90deg,transparent,rgba(124,109,240,0.8),transparent)]" />

          <div className="p-8 sm:p-9">
          <div className="flex items-center justify-between mb-7">
            <div>
              <div className="text-[22px] font-semibold tracking-tight text-white">
                Ska<span className="text-accent">di</span>
              </div>
              <div className="mt-1 text-[12px] text-white/60">
                Sign in to access your dashboard
              </div>
            </div>
            <div className="text-[10px] uppercase tracking-[0.12em] text-white/50">
              {role === "admin" ? "Admin" : "Client"}
            </div>
          </div>

          {/* Role Toggle */}
          <div className="auth-tabs flex p-1 bg-white/5 border border-white/10 rounded-[12px] mb-6">
            <button
              type="button"
              onClick={() => setRole("client")}
              className={`auth-tab flex-1 py-2 rounded-[8px] text-[12px] font-semibold transition-all ${
                role === "client"
                  ? "bg-white/10 border border-white/10 text-white shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Client
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`auth-tab flex-1 py-2 rounded-[8px] text-[12px] font-semibold transition-all ${
                role === "admin"
                  ? "bg-white/10 border border-white/10 text-white shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Admin
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="auth-field space-y-1.5">
              <label
                className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/55 ml-0.5"
                htmlFor="email"
              >
                Email
              </label>
              <input 
                id="email"
                type="email" 
                defaultValue={role === "admin" ? "admin@skadi.ai" : "divyasree@example.com"}
                className="w-full bg-black/20 border border-white/10 rounded-[12px] px-4 py-3 text-white text-[13px] outline-none placeholder:text-white/35 focus:border-accent/70 focus:bg-black/30 transition-colors"
              />
            </div>

            <div className="auth-field space-y-1.5">
              <label
                className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/55 ml-0.5"
                htmlFor="password"
              >
                Password
              </label>
              <input 
                id="password"
                type="password" 
                defaultValue="password"
                className="w-full bg-black/20 border border-white/10 rounded-[12px] px-4 py-3 text-white text-[13px] outline-none placeholder:text-white/35 focus:border-accent/70 focus:bg-black/30 transition-colors"
              />
            </div>

            <button 
              type="submit"
              className="auth-btn w-full bg-accent hover:bg-accent/90 text-white text-[13px] font-semibold py-3 rounded-[12px] transition-colors mt-2 shadow-[0_18px_50px_rgba(124,109,240,0.30)]"
            >
              Sign In
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-[11px] text-white/50">
            <span>Demo credentials</span>
            <span className="font-mono text-white/55">
              {role === "admin" ? "admin@skadi.ai" : "divyasree@example.com"} · ••••••••
            </span>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
