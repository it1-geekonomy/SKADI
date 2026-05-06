"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [role, setRole] = useState<"client" | "admin">("admin");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(role === "admin" ? "/admin" : "/client");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1c1c1a] relative overflow-hidden font-geist">
      <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_0%,rgba(28,69,50,0.28),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_50%_110%,rgba(255,255,255,0.06),transparent_58%)]" />

      <div className="relative z-10 w-full max-w-[420px] px-6">
        <div className="rounded-[12px] border border-black/10 bg-[#f5f0e8] shadow-[0_26px_70px_rgba(0,0,0,0.55)] overflow-hidden">
          <div className="px-8 pt-10 pb-8">
            <div className="flex justify-center">
              <div className="relative w-[320px] h-[64px]">
                <Image
                  src="/Skadi Logo Final-01 (1).svg"
                  alt="Skadi"
                  fill
                  priority
                  sizes="320px"
                  className="object-contain"
                />
              </div>
            </div>

            <div className="mt-7 flex border border-[#d9d2c7] rounded-[8px] overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`flex-1 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                  role === "client"
                    ? "bg-[#1c4532] text-white"
                    : "bg-white text-[#1c4532] hover:bg-[#f1ece3]"
                }`}
              >
                Client
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                  role === "admin"
                    ? "bg-[#1c4532] text-white"
                    : "bg-white text-[#1c4532] hover:bg-[#f1ece3]"
                }`}
              >
                Admin
              </button>
            </div>

            <form className="mt-7 space-y-4" onSubmit={handleLogin}>
              <div className="space-y-1.5">
                <label
                  className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b6b68]"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue={
                    role === "admin" ? "admin@skadi.ai" : "divyasree@example.com"
                  }
                  className="w-full bg-white border border-[#d9d2c7] rounded-[8px] px-3.5 py-2.5 text-[#1a1a18] text-[13px] outline-none focus:border-[#1c4532] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b6b68]"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  defaultValue="password"
                  className="w-full bg-white border border-[#d9d2c7] rounded-[8px] px-3.5 py-2.5 text-[#1a1a18] text-[13px] outline-none focus:border-[#1c4532] transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1c4532] hover:bg-[#163a2a] text-white text-[12px] font-semibold py-2.5 rounded-[8px] transition-colors mt-2 uppercase tracking-[0.12em]"
              >
                Sign In
              </button>
            </form>

            <div className="mt-4 text-[10px] text-[#9a9a96] flex items-center justify-between">
              <span>Demo credentials</span>
              <span className="font-mono">
                {role === "admin" ? "admin@skadi.ai" : "divyasree@example.com"} ·
                ••••••••
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
