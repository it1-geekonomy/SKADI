"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "admin@skadi.ai";
const ADMIN_PASSWORD = "Skadi@2026!";

export default function LoginPage() {
  const [role, setRole] = useState<"client" | "admin">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === "client") {
      setMessage("Client login feature is coming soon.");
      return;
    }

    const isValidAdmin =
      email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;

    if (!isValidAdmin) {
      setMessage("Invalid credentials.");
      return;
    }

    router.push("/admin");
  };

  const handleRoleChange = (nextRole: "client" | "admin") => {
    setRole(nextRole);
    setMessage("");
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
                onClick={() => handleRoleChange("client")}
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
                onClick={() => handleRoleChange("admin")}
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
                  value={email}
                  placeholder="Enter email address"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setMessage("");
                  }}
                  autoComplete="email"
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
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Enter password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setMessage("");
                    }}
                    autoComplete="current-password"
                    className="w-full bg-white border border-[#d9d2c7] rounded-[8px] px-3.5 py-2.5 pr-10 text-[#1a1a18] text-[13px] outline-none focus:border-[#1c4532] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-[#6b6b68] hover:text-[#1c4532] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {message ? (
                <p
                  className={`text-[11px] font-medium ${
                    message === "Invalid credentials."
                      ? "text-red-600"
                      : "text-[#1c4532]"
                  }`}
                >
                  {message}
                </p>
              ) : null}

              <button
                type="submit"
                className="w-full bg-[#1c4532] hover:bg-[#163a2a] text-white text-[12px] font-semibold py-2.5 rounded-[8px] transition-colors mt-2 uppercase tracking-[0.12em]"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58A2 2 0 0 0 12 14a2 2 0 0 0 1.42-.58" />
      <path d="M9.88 5.09A10.76 10.76 0 0 1 12 5c6.5 0 10 7 10 7a18.7 18.7 0 0 1-2.11 3.02" />
      <path d="M6.61 6.61C3.74 8.54 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.39-1.03" />
    </svg>
  );
}
