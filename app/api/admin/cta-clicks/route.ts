import { NextRequest, NextResponse } from "next/server";

import { connectMongo } from "@/lib/mongodb";
import { CtaClick } from "@/models/CtaClick";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseIntParam(value: string | null, fallback: number, max: number) {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(n, max);
}

export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const { searchParams } = req.nextUrl;
    const limit = parseIntParam(searchParams.get("limit"), 50, 500);

    const clicks = await CtaClick.find({})
      .sort({ created_at: -1 })
      .limit(limit)
      .lean()
      .exec();

    return NextResponse.json({ ok: true, clicks });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load clicks";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

