"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";

interface NavbarProps {
  onBookDemo?: () => void;
}

type RetellClient = {
  on: (event: "call_started" | "call_ended" | "error", callback: (...args: unknown[]) => void) => void;
  startCall: (args: { accessToken: string }) => Promise<void>;
  stopCall: () => void;
};

type RetellModule = {
  RetellWebClient: new () => RetellClient;
};

const RETELL_WEB_SDK_URL = "https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/+esm";
const RETELL_API_KEY = "key_abacf5cf4323aa35457d2953ae96";
const AGENT_ID = "agent_8089ac4f54bf997853d14b9962";
const CAMPAIGN_ID = "email_campaign_1";

type WebCallResponse = {
  access_token?: string;
  message?: string;
  error?: string;
};

async function readWebCallResponse(response: Response): Promise<WebCallResponse> {
  const text = await response.text();

  try {
    return JSON.parse(text) as WebCallResponse;
  } catch {
    return {
      error: text.trim().startsWith("<")
        ? "Retell web-call endpoint returned HTML instead of JSON."
        : text || `API ${response.status}`,
    };
  }
}

async function createWebCallDirect() {
  const response = await fetch("https://api.retellai.com/v2/create-web-call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RETELL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agent_id: AGENT_ID,
      retell_llm_dynamic_variables: {
        prospect_name: "",
        prospect_company: "",
        campaign_id: CAMPAIGN_ID,
      },
    }),
  });

  const data = await readWebCallResponse(response);
  if (!response.ok) {
    throw new Error(data.message || data.error || `API ${response.status}`);
  }
  if (!data.access_token) {
    throw new Error("No access token returned");
  }

  return data.access_token;
}

async function createWebCall() {
  return createWebCallDirect();
}

export default function Navbar({}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [callState, setCallState] = useState<"idle" | "connecting" | "active" | "ended">("idle");
  const [callStatus, setCallStatus] = useState("");
  const retellClientRef = useRef<RetellClient | null>(null);

  const resetCall = () => {
    setCallState("idle");
    setCallStatus("");
  };

  const setCallError = (message: string) => {
    retellClientRef.current = null;
    resetCall();
    setCallStatus(message);
  };

  const startCall = async () => {
    setCallState("connecting");
    setCallStatus("Creating call session...");

    if (!window.isSecureContext) {
      setCallError("Open this page on localhost or HTTPS to use the microphone.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCallError("Open this page on localhost or HTTPS to use the microphone.");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotFoundError") {
        setCallError("No microphone was found.");
        return;
      }
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setCallError("Allow microphone access, then click again.");
        return;
      }
      setCallError("Microphone access is required.");
      return;
    }

    let accessToken: string;
    try {
      accessToken = await createWebCall();
    } catch (error) {
      setCallError(error instanceof Error ? `Call setup error: ${error.message}` : "Call setup error");
      return;
    }

    try {
      const retellModule = (await import(
        /* webpackIgnore: true */ RETELL_WEB_SDK_URL
      )) as RetellModule;
      const retellClient = new retellModule.RetellWebClient();
      retellClientRef.current = retellClient;

      retellClient.on("call_started", () => {
        setCallState("active");
        setCallStatus("Live - Skadi is listening");
      });
      retellClient.on("call_ended", () => {
        retellClientRef.current = null;
        setCallState("ended");
        setCallStatus("Call ended. Thanks for listening.");
      });
      retellClient.on("error", (error) => {
        const message = error instanceof Error ? error.message : "Unknown SDK error";
        setCallError(`SDK error: ${message}`);
      });

      await retellClient.startCall({ accessToken });
    } catch (error) {
      retellClientRef.current = null;
      setCallError(error instanceof Error ? `Connect error: ${error.message}` : "Connect error");
    }
  };

  const endCall = () => {
    retellClientRef.current?.stopCall();
    retellClientRef.current = null;
    setCallState("ended");
    setCallStatus("Call ended. Thanks for listening.");
  };

  const handleListenClick = () => {
    if (callState === "active") {
      endCall();
      return;
    }
    void startCall();
  };

  const listenLabel =
    callState === "connecting"
      ? "Connecting..."
      : callState === "active"
        ? "End Call"
        : callState === "ended"
          ? "Listen Again"
          : "Listen to Skadi in Action";

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
        <ul className="hidden lg:flex gap-10 list-none">
          {[
            { label: "The Problem", href: "#problem" },
            { label: "ROI Calculator", href: "#roi" },
            { label: "How We Fix It", href: "#fix" },
            { label: "Pricing", href: "#pricing" },
            // { label: "Blogs", href: "/blogs" },
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
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleListenClick();
                }}
                disabled={callState === "connecting"}
                className={`mx-auto flex max-w-[280px] items-center justify-center gap-2 px-5 py-3 text-[12px] font-medium uppercase tracking-[0.18em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70 ${listenButtonClass}`}
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
                <p className="mt-3 text-center text-[11px] uppercase tracking-[0.12em] text-forest">
                  {callStatus}
                </p>
              )}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}