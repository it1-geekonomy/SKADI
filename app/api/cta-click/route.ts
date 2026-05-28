import { NextRequest, NextResponse } from "next/server";

import { connectMongo } from "@/lib/mongodb";
import { CtaClick } from "@/models/CtaClick";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function firstIpFromForwardedFor(value: string | null): string | null {
  if (!value) return null;
  const first = value.split(",")[0]?.trim();
  return first || null;
}

function getClientIp(req: NextRequest): string {
  // Common reverse-proxy headers (Vercel/Cloudflare/Nginx/etc.)
  const xf = firstIpFromForwardedFor(req.headers.get("x-forwarded-for"));
  const realIp = req.headers.get("x-real-ip")?.trim() || null;
  const cf = req.headers.get("cf-connecting-ip")?.trim() || null;
  const fly = req.headers.get("fly-client-ip")?.trim() || null;

  return xf || cf || realIp || fly || "";
}

function getGeoFromHeaders(req: NextRequest): {
  country: string;
  region: string;
  city: string;
} {
  // Vercel (if enabled for your project)
  const vercelCountry = req.headers.get("x-vercel-ip-country")?.trim() ?? "";
  const vercelRegion = req.headers.get("x-vercel-ip-country-region")?.trim() ?? "";
  const vercelCity = req.headers.get("x-vercel-ip-city")?.trim() ?? "";

  // Cloudflare (limited but common)
  const cfCountry = req.headers.get("cf-ipcountry")?.trim() ?? "";

  return {
    country: vercelCountry || cfCountry,
    region: vercelRegion,
    city: vercelCity,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { cta?: unknown }
      | null;
    const cta = typeof body?.cta === "string" && body.cta.trim() ? body.cta : null;
    if (!cta) {
      return NextResponse.json(
        { ok: false, error: "Missing cta" },
        { status: 400 }
      );
    }

    await connectMongo();

    const ip = getClientIp(req);
    const geo = getGeoFromHeaders(req);
    const userAgent = req.headers.get("user-agent") ?? "";
    const referer = req.headers.get("referer") ?? "";
    const path = req.nextUrl?.pathname ?? "";

    await CtaClick.create({
      cta,
      ip,
      country: geo.country,
      region: geo.region,
      city: geo.city,
      user_agent: userAgent,
      referer,
      path,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to track click";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}

