"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [role, setRole] = useState<"client" | "admin">("client");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(role === "admin" ? "/admin" : "/client");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg relative overflow-hidden font-geist">
      {/* Subtle glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[360px] px-6">
        <div className="bg-surface border border-border p-10 rounded-[12px] shadow-2xl">
          
          <div className="auth-logo text-[22px] font-semibold tracking-tight text-text-main mb-7">
            Ska<span className="text-accent">di</span>
          </div>

          {/* Role Toggle */}
          <div className="auth-tabs flex p-1 bg-surface-hover border border-border rounded-[8px] mb-6">
            <button 
              onClick={() => setRole("client")}
              className={`auth-tab flex-1 py-1.5 rounded-[6px] text-[12px] font-medium transition-all ${
                role === "client" ? "bg-surface border border-border text-text-main" : "text-text-dim hover:text-text-main"
              }`}
            >
              Client
            </button>
            <button 
              onClick={() => setRole("admin")}
              className={`auth-tab flex-1 py-1.5 rounded-[6px] text-[12px] font-medium transition-all ${
                role === "admin" ? "bg-surface border border-border text-text-main" : "text-text-dim hover:text-text-main"
              }`}
            >
              Admin
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="auth-field space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-dim ml-0.5" htmlFor="email">Email</label>
              <input 
                id="email"
                type="email" 
                defaultValue={role === "admin" ? "admin@skadi.ai" : "divyasree@example.com"}
                className="w-full bg-surface-hover border border-border rounded-[8px] px-3 py-2 text-text-main text-[13px] focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="auth-field space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-[0.05em] text-text-dim ml-0.5" htmlFor="password">Password</label>
              <input 
                id="password"
                type="password" 
                defaultValue="password"
                className="w-full bg-surface-hover border border-border rounded-[8px] px-3 py-2 text-text-main text-[13px] focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <button 
              type="submit"
              className="auth-btn w-full bg-accent hover:bg-accent/90 text-white text-[13px] font-medium py-2.5 rounded-[8px] transition-colors mt-2"
            >
              Sign In
            </button>
          </form>

          <div className="auth-hint mt-4 text-center">
            <p className="text-text-muted text-[11px]">
              {role === 'admin' ? 'admin@skadi.ai' : 'divyasree@example.com'} &nbsp;·&nbsp; ••••••••
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
