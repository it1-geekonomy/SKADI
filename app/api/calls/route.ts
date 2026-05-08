import { NextRequest, NextResponse } from 'next/server';

import { connectMongo } from '@/lib/mongodb';
import { mapDbCallToTableRow } from '@/lib/mapDbCallForTable';
import { getRangeBounds } from '@/lib/retell-call-map';
import { Call } from '@/models/Call';

export const runtime = 'nodejs';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 500;

function parseIntParam(
  value: string | null,
  fallback: number,
  max?: number
): number {
  if (value === null || value === '') {
    return fallback;
  }
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n < 0) {
    return fallback;
  }
  if (max !== undefined && n > max) {
    return max;
  }
  return n;
}

export async function GET(request: NextRequest) {
  try {
    await connectMongo();

    const { searchParams } = request.nextUrl;
    const limit = parseIntParam(
      searchParams.get('limit'),
      DEFAULT_LIMIT,
      MAX_LIMIT
    );
    const skip = parseIntParam(searchParams.get('skip'), 0);
    const range = searchParams.get('range') ?? '7d';
    const outcome = searchParams.get('outcome') ?? 'all';

    const { startMs, endMs } = getRangeBounds(range);

    const filter: Record<string, unknown> = {
      start_time: {
        $gte: new Date(startMs),
        $lte: new Date(endMs),
      },
      call_type: { $ne: 'web_call' },
      /** At least one phone-like field (hides legacy web/empty rows) */
      $or: [
        { from_number: { $regex: /\S/ } },
        { to_number: { $regex: /\S/ } },
      ],
    };

    if (
      outcome === 'booked' ||
      outcome === 'callback' ||
      outcome === 'missed'
    ) {
      filter.outcome = outcome;
    }

    const [docs, total] = await Promise.all([
      Call.find(filter)
        .sort({ start_time: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Call.countDocuments(filter).exec(),
    ]);

    const calls = docs.map((doc) =>
      mapDbCallToTableRow({
        call_id: doc.call_id,
        from_number: doc.from_number,
        to_number: doc.to_number,
        start_time: doc.start_time,
        duration_sec: doc.duration_sec,
        sentiment: doc.sentiment,
        direction: doc.direction,
        outcome: doc.outcome,
      })
    );

    return NextResponse.json({
      calls,
      total,
      has_more: skip + calls.length < total,
    });
  } catch (error) {
    console.error('[calls]', error);
    const message =
      error instanceof Error ? error.message : 'Failed to load calls';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
