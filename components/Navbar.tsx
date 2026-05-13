"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSkadiWebCall } from "@/components/useSkadiWebCall";

interface NavbarProps {
  onBookDemo?: () => void;
}

export default function Navbar({}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { callState, callStatus, handleListenClick, listenLabel } = useSkadiWebCall();

  const listenButtonClass =
    callState === "active"
      ? "bg-[#e05555] text-white"
      : callState === "connecting"
        ? "bg-[#3a7a42] text-[#060d07]"
        : "bg-[#5fce6b] text-[#060d07]";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between pr-6 h-[68px] bg-[rgba(245,240,232,0.96)] backdrop-blur-[16px] border-b border-stone">
        <Link href="/" className="no-underline leading-none py-0 -translate-x-20">
          <Image
            src="/logo.png"
            alt="Skadi"
            width={320}
            height={200}
            className="h-[clamp(200px,24vw,200px)] w-auto block"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex absolute left-[180px] right-[300px] top-1/2 -translate-y-1/2 items-center justify-center gap-10 list-none">
          {[
            { label: "The Problem", href: "#problem" },
            { label: "ROI Calculator", href: "#roi" },
            { label: "How We Fix It", href: "#fix" },
            { label: "Pricing", href: "#pricing" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-[13px] font-normal text-mid no-underline tracking-[0.02em] transition-colors duration-200 hover:text-forest"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA — unchanged */}
        <div className="relative hidden lg:block">
          <button
            onClick={handleListenClick}
            disabled={callState === "connecting"}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-none text-[12px] font-medium uppercase tracking-[0.18em] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(95,206,107,0.3)] disabled:cursor-not-allowed disabled:opacity-70 ${listenButtonClass}`}
            aria-label={listenLabel}
            title={callStatus || undefined}
          >
            {callState !== "active" && (
              <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#060d07]">
                <svg width="8" height="10" viewBox="0 0 8 10" fill="none" aria-hidden="true">
                  <path d="M1 1L7 5L1 9V1Z" fill="#5fce6b" />
                </svg>
              </span>
            )}
            <span>{listenLabel}</span>
          </button>
          {callStatus && (
            <p className="absolute right-0 top-[calc(100%+6px)] w-[280px] text-right text-[10px] uppercase tracking-[0.1em] text-forest">
              {callStatus}
            </p>
          )}
        </div>

        {/* Mobile Hamburger — no CTA here anymore */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <div className={`w-6 h-0.5 bg-forest transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-6 h-0.5 bg-forest transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
          <div className={`w-6 h-0.5 bg-forest transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`fixed top-[68px] left-0 right-0 z-[90] max-h-[calc(100dvh-68px)] overflow-y-auto overscroll-contain bg-[rgba(245,240,232,0.98)] backdrop-blur-[16px] border-b border-stone lg:hidden transition-all duration-500 ease-out ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-6 py-6">
          <ul className="flex flex-col gap-6 list-none">
            {[
              { label: "The Problem", href: "#problem", delay: 0 },
              { label: "How We Fix It", href: "#fix", delay: 50 },
              { label: "ROI Calculator", href: "#roi", delay: 100 },
              { label: "Pricing", href: "#pricing", delay: 150 },
            ].map((item) => (
              <li
                key={item.href}
                className={`transition-all duration-500 ease-out ${
                  isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
                style={{ transitionDelay: isMenuOpen ? `${item.delay}ms` : "0ms" }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[15px] font-medium text-forest no-underline tracking-[0.02em] transition-all duration-300 hover:text-canopy hover:translate-x-2 block py-2 relative group"
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-canopy transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
            {callStatus && (
              <li className="pt-4 border-t border-stone text-center text-[11px] uppercase tracking-[0.12em] text-forest">
                {callStatus}
              </li>
            )}
          </ul>
        </div>
      </div>

      {/*
        ─── MOBILE CTA — fixed just below the 68px navbar ──────────────────────
        fixed top-[68px] keeps it pinned under the navbar on scroll.
        z-[85] sits below the mobile dropdown (z-[90]) but above page content.
        lg:hidden hides it on desktop (desktop button lives inside <nav>).

        ⚠️  Your page layout needs enough top padding on mobile to clear both
        the navbar (68px) and this bar (~60px) — e.g. add `pt-[128px] lg:pt-[68px]`
        to your <main> wrapper so content starts below both fixed bars.
      */}
      <div className="lg:hidden fixed top-[68px] left-0 right-0 z-[85] flex flex-col items-center justify-center px-6 py-3 bg-[rgba(245,240,232,0.96)] backdrop-blur-[16px] border-b border-stone">
        <button
          onClick={handleListenClick}
          disabled={callState === "connecting"}
          className={`inline-flex items-center justify-center gap-2 px-5 py-3 w-full max-w-sm text-[12px] font-medium uppercase tracking-[0.18em] transition-all duration-200 hover:shadow-[0_12px_40px_rgba(95,206,107,0.3)] disabled:cursor-not-allowed disabled:opacity-70 ${listenButtonClass}`}
          aria-label={listenLabel}
          title={callStatus || undefined}
        >
          {callState !== "active" && (
            <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#060d07]">
              <svg width="8" height="10" viewBox="0 0 8 10" fill="none" aria-hidden="true">
                <path d="M1 1L7 5L1 9V1Z" fill="#5fce6b" />
              </svg>
            </span>
          )}
          <span>{listenLabel}</span>
        </button>
        {callStatus && (
          <p className="mt-1 text-center text-[10px] uppercase tracking-[0.1em] text-forest">
            {callStatus}
          </p>
        )}
      </div>
    </>
  );
}