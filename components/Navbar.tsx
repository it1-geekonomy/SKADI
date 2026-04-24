"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between pr-6 h-[68px] bg-[rgba(245,240,232,0.96)] backdrop-blur-[16px] border-b border-stone">
      <Link href="#" className="no-underline leading-none py-0 -translate-x-20">
        <Image
          src="/logo.png"
          alt="Skadi"
          width={320}
          height={200}
          className="h-[clamp(200px,24vw,200px)] w-auto block"
        />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden lg:flex gap-10 list-none">
        {[
          { label: "The Problem", href: "#problem" },
          { label: "How We Fix It", href: "#fix" },
          { label: "ROI Calculator", href: "#roi" },
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

      {/* Desktop CTA */}
      <Link
        href="#"
        className="hidden lg:block text-[13px] font-medium px-6 py-2.5 bg-forest text-parchment rounded no-underline tracking-[0.04em] transition-colors duration-200 hover:bg-canopy"
      >
        Book a Demo
      </Link>

      {/* Mobile Hamburger Menu */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden flex flex-col gap-1.5 p-2"
        aria-label="Toggle menu"
      >
        <div className={`w-6 h-0.5 bg-forest transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
        <div className={`w-6 h-0.5 bg-forest transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
        <div className={`w-6 h-0.5 bg-forest transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
      </button>
    </nav>
      {/* Mobile Menu Dropdown */}
      <div 
        className={`fixed top-[68px] left-0 right-0 z-[90] bg-[rgba(245,240,232,0.98)] backdrop-blur-[16px] border-b border-stone lg:hidden transition-all duration-500 ease-out ${
          isMenuOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
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
                  isMenuOpen 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-4'
                }`}
                style={{ 
                  transitionDelay: isMenuOpen ? `${item.delay}ms` : '0ms'
                }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[15px] font-medium text-forest no-underline tracking-[0.02em] transition-all duration-300 hover:text-canopy hover:translate-x-2 block py-2 relative group"
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-canopy transition-all duration-300 group-hover:w-full"></div>
                </Link>
              </li>
            ))}
            <li 
              className={`pt-4 border-t border-stone transition-all duration-500 ease-out ${
                isMenuOpen 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ 
                transitionDelay: isMenuOpen ? '200ms' : '0ms'
              }}
            >
              <Link
                href="#"
                onClick={() => setIsMenuOpen(false)}
                className="text-[15px] font-medium px-6 py-3 max-w-[200px] bg-forest text-parchment rounded no-underline tracking-[0.04em] transition-all duration-300 hover:bg-canopy hover:scale-105 hover:shadow-lg block text-center transform mx-auto"
              >
                Book a Demo
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}