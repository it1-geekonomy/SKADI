import { NextResponse } from "next/server";

import { getSarvamEnv, resolveSarvamAppId } from "@/lib/sarvam";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const env = getSarvamEnv();
    const appId = await resolveSarvamAppId();

    return NextResponse.json({
      orgId: env.orgId,
      workspaceId: env.workspaceId,
      appId,
      agentVariables: env.agentVariables,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sarvam session failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
