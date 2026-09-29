import { NextResponse } from "next/server";

import { getSarvamEnv, isSarvamSignedUrlPath, resolveSarvamAppId, sarvamRuntimeUrl } from "@/lib/sarvam";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { path } = await context.params;
    const env = getSarvamEnv();
    const appId = await resolveSarvamAppId();

    if (!isSarvamSignedUrlPath(path, appId)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const incoming = new URL(request.url);
    const upstream = await fetch(sarvamRuntimeUrl(appId, incoming.search), {
      headers: { "X-API-Key": env.apiKey },
      cache: "no-store",
    });
    const body = await upstream.text();

    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sarvam request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
