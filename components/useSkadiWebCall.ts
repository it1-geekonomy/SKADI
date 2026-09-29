"use client";

import { useEffect, useRef, useState } from "react";

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

type SarvamSession = {
  orgId?: string;
  workspaceId?: string;
  appId?: string;
  agentVariables?: Record<string, string>;
  error?: string;
};

type SarvamAgent = {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  waitForConnect: (timeout?: number) => Promise<boolean>;
};

type SarvamBrowserModule = {
  ConversationAgent: new (options: {
    apiKey: string;
    platform: "browser";
    baseUrl: string;
    config: {
      user_identifier_type: "custom";
      user_identifier: string;
      org_id: string;
      workspace_id: string;
      app_id: string;
      interaction_type: string;
      input_sample_rate: 16000;
      output_sample_rate: 16000;
      agent_variables?: Record<string, string>;
    };
    audioInterface: unknown;
    stateCallback: (state: string) => void;
    endCallback: () => Promise<void>;
  }) => SarvamAgent;
  BrowserAudioInterface: new () => unknown;
  InteractionType: { CALL: string };
  AgentState: {
    CONNECTED: string;
    LISTENING: string;
    SPEAKING: string;
    ERROR: string;
  };
};

export type SkadiCallState = "idle" | "connecting" | "active" | "ended";

const RETELL_WEB_SDK_URL = "https://cdn.jsdelivr.net/npm/retell-client-js-sdk@latest/+esm";
const RETELL_API_KEY = "key_abacf5cf4323aa35457d2953ae96";
const AGENT_ID = "agent_e2296d7b8a062fdaa8125e4c2d";
const CAMPAIGN_ID = "email_campaign_1";

function readIndiaFromBrowser(): boolean {
  if (typeof window === "undefined") return false;

  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isIndiaLocale = languages.some((lang) => lang.toLowerCase().endsWith("-in"));
  const isIndiaTimeZone = timeZone === "Asia/Kolkata" || timeZone === "Asia/Calcutta";

  return isIndiaLocale || isIndiaTimeZone;
}

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

async function createSarvamSession(): Promise<Required<Pick<SarvamSession, "orgId" | "workspaceId" | "appId">> & SarvamSession> {
  const response = await fetch("/api/sarvam-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data = (await response.json()) as SarvamSession;
  if (!response.ok || !data.orgId || !data.workspaceId || !data.appId) {
    throw new Error(data.error || "Sarvam session failed");
  }
  return data as Required<Pick<SarvamSession, "orgId" | "workspaceId" | "appId">> & SarvamSession;
}

export function useSkadiWebCall() {
  const [callState, setCallState] = useState<SkadiCallState>("idle");
  const [callStatus, setCallStatus] = useState("");
  const retellClientRef = useRef<RetellClient | null>(null);
  const sarvamAgentRef = useRef<SarvamAgent | null>(null);
  const indiaFromIpRef = useRef<boolean | null>(null);
  const ignoreSarvamEndRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/visitor-country", { cache: "no-store", signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { country?: string | null } | null) => {
        if (!data?.country) return;
        indiaFromIpRef.current = data.country.toUpperCase() === "IN";
      })
      .catch(() => {});

    return () => {
      controller.abort();
      ignoreSarvamEndRef.current = true;
      retellClientRef.current?.stopCall();
      void sarvamAgentRef.current?.stop();
    };
  }, []);

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

  const shouldUseSarvam = () => {
    if (indiaFromIpRef.current !== null) return indiaFromIpRef.current;
    return readIndiaFromBrowser();
  };

  const resetCall = () => {
    setCallState("idle");
    setCallStatus("");
  };

  const setCallError = (message: string) => {
    ignoreSarvamEndRef.current = true;
    retellClientRef.current = null;
    const sarvamAgent = sarvamAgentRef.current;
    sarvamAgentRef.current = null;
    void sarvamAgent?.stop();
    resetCall();
    setCallStatus(message);
  };

  const ensureMicrophone = async () => {
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setCallError("Open this page on localhost or HTTPS to use the microphone.");
      return false;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotFoundError") {
        setCallError("No microphone was found.");
        return false;
      }
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setCallError("Allow microphone access, then click again.");
        return false;
      }
      setCallError("Microphone access is required.");
      return false;
    }
  };

  const startRetellCall = async () => {
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

  const startSarvamCall = async () => {
    let session: Awaited<ReturnType<typeof createSarvamSession>>;
    try {
      session = await createSarvamSession();
    } catch (error) {
      setCallError(error instanceof Error ? `Call setup error: ${error.message}` : "Call setup error");
      return;
    }

    try {
      const sarvam = (await import("sarvam-conv-ai-sdk/browser")) as SarvamBrowserModule;
      const liveStates = new Set([
        sarvam.AgentState.CONNECTED,
        sarvam.AgentState.LISTENING,
        sarvam.AgentState.SPEAKING,
      ]);

      const agent = new sarvam.ConversationAgent({
        apiKey: "server-proxy",
        platform: "browser",
        baseUrl: `${window.location.origin}/api/sarvam-runtime/`,
        config: {
          user_identifier_type: "custom",
          user_identifier: "skadi-web-demo",
          org_id: session.orgId,
          workspace_id: session.workspaceId,
          app_id: session.appId,
          interaction_type: sarvam.InteractionType.CALL,
          input_sample_rate: 16000,
          output_sample_rate: 16000,
          agent_variables: session.agentVariables,
        },
        audioInterface: new sarvam.BrowserAudioInterface(),
        stateCallback: (state) => {
          if (liveStates.has(state)) {
            setCallState("active");
            setCallStatus("Live - Skadi is listening");
            return;
          }
          if (state === sarvam.AgentState.ERROR) {
            setCallError("Sarvam could not connect. Try again.");
          }
        },
        endCallback: async () => {
          sarvamAgentRef.current = null;
          if (ignoreSarvamEndRef.current) {
            ignoreSarvamEndRef.current = false;
            return;
          }
          setCallState("ended");
          setCallStatus("Call ended. Thanks for listening.");
        },
      });

      sarvamAgentRef.current = agent;
      ignoreSarvamEndRef.current = false;
      await agent.start();
      const connected = await agent.waitForConnect(15);
      if (!connected) {
        setCallError("Sarvam connection timed out. Try again.");
      }
    } catch (error) {
      sarvamAgentRef.current = null;
      setCallError(error instanceof Error ? `Connect error: ${error.message}` : "Connect error");
    }
  };

  const startCall = async () => {
    setCallState("connecting");
    setCallStatus("Creating call session...");

    if (!(await ensureMicrophone())) return;

    if (shouldUseSarvam()) {
      await startSarvamCall();
      return;
    }

    await startRetellCall();
  };

  const endCall = () => {
    ignoreSarvamEndRef.current = false;
    retellClientRef.current?.stopCall();
    retellClientRef.current = null;
    const sarvamAgent = sarvamAgentRef.current;
    sarvamAgentRef.current = null;
    void sarvamAgent?.stop();
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
