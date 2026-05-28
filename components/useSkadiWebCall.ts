"use client";

import { useRef, useState } from "react";

type RetellClient = {
  on: (event: "call_started" | "call_ended" | "error", callback: (...args: unknown[]) => void) => void;
  startCall: (args: { accessToken: string }) => Promise<void>;
  stopCall: () => void;
};

type RetellModule = {
  RetellWebClient: new () => RetellClient;
};

type WebCallResponse = {
  access_token?: string;
  message?: string;
  error?: string;
};

export type SkadiCallState = "idle" | "connecting" | "active" | "ended";

const RETELL_WEB_SDK_URL = "https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/+esm";
const RETELL_API_KEY = "key_abacf5cf4323aa35457d2953ae96";
const AGENT_ID = "agent_8089ac4f54bf997853d14b9962";
const CAMPAIGN_ID = "email_campaign_1";

async function readWebCallResponse(response: Response): Promise<WebCallResponse> {
  const text = await response.text();

  try {
    return JSON.parse(text) as WebCallResponse;
  } catch {
    return {
      error: text.trim().startsWith("<")
        ? "Retell returned HTML instead of JSON."
        : text || `API ${response.status}`,
    };
  }
}

async function createWebCall() {
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

export function useSkadiWebCall() {
  const [callState, setCallState] = useState<SkadiCallState>("idle");
  const [callStatus, setCallStatus] = useState("");
  const retellClientRef = useRef<RetellClient | null>(null);

  const trackCtaClick = () => {
    try {
      void fetch("/api/cta-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cta: "listen_skadi_in_action",
          call_state: callState,
        }),
      });
    } catch {
      // best-effort; ignore tracking failures
    }
  };

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

    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
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
    trackCtaClick();
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

  return {
    callState,
    callStatus,
    handleListenClick,
    listenLabel,
  };
}
