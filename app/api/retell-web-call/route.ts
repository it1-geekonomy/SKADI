import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RETELL_BASE = "https://api.retellai.com";
const DEFAULT_AGENT_ID = "agent_8089ac4f54bf997853d14b9962";
const DEFAULT_CAMPAIGN_ID = "email_campaign_1";

export async function POST() {
  const apiKey =
    process.env.RETELL_API_KEY ?? "key_abacf5cf4323aa35457d2953ae96";
  const agentId = process.env.RETELL_WEB_AGENT_ID ?? DEFAULT_AGENT_ID;

  try {
    const response = await fetch(`${RETELL_BASE}/v2/create-web-call`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: agentId,
        retell_llm_dynamic_variables: {
          prospect_name: "",
          prospect_company: "",
          campaign_id: DEFAULT_CAMPAIGN_ID,
        },
      }),
    });

    const data = (await response.json()) as {
      access_token?: string;
      message?: string;
      error?: string;
    };

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || data.error || `Retell API ${response.status}` },
        { status: response.status }
      );
    }

    if (!data.access_token) {
      return NextResponse.json(
        { error: "Retell did not return an access token" },
        { status: 502 }
      );
    }

    return NextResponse.json({ access_token: data.access_token });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create Retell web call",
      },
      { status: 500 }
    );
  }
}
