import { NextRequest, NextResponse } from 'next/server';

import { connectMongo } from '@/lib/mongodb';
import { mapDbCallToTableRow } from '@/lib/mapDbCallForTable';
import { getRangeBounds } from '@/lib/retell-call-map';
import { Call } from '@/models/Call';

export const runtime = 'nodejs';

const DEFAULT_RECENT_LIMIT = 5;
const MAX_RECENT_LIMIT = 20;

function parseIntParam(value: string | null, fallback: number, max?: number) {
  if (value == null || value === '') return fallback;
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n < 0) return fallback;
  if (max != null && n > max) return max;
  return n;
}

function fmtDurationMMSS(seconds: number) {
  const s = Math.max(0, Math.round(seconds || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

function basePhoneFilter(startMs: number, endMs: number) {
  return {
    start_time: { $gte: new Date(startMs), $lte: new Date(endMs) },
    call_type: { $ne: 'web_call' as const },
    $or: [{ from_number: { $regex: /\S/ } }, { to_number: { $regex: /\S/ } }],
  };
}

export async function GET(request: NextRequest) {
  try {
    await connectMongo();

    const { searchParams } = request.nextUrl;
    const recentLimit = parseIntParam(
      searchParams.get('recentLimit'),
      DEFAULT_RECENT_LIMIT,
      MAX_RECENT_LIMIT
    );

    const { startMs: start30, endMs: end30 } = getRangeBounds('30d');
    const { startMs: start7, endMs: end7 } = getRangeBounds('7d');
    const { startMs: startToday, endMs: endToday } = getRangeBounds('today');

    const filter30 = basePhoneFilter(start30, end30);
    const filter7 = basePhoneFilter(start7, end7);
    const filterToday = basePhoneFilter(startToday, endToday);

    const [agg30, todayCalls, recentDocs] = await Promise.all([
      Call.aggregate([
        { $match: filter30 },
        {
          $group: {
            _id: null,
            total_calls: { $sum: 1 },
            booked_calls: {
              $sum: {
                $cond: [{ $eq: ['$outcome', 'booked'] }, 1, 0],
              },
            },
            avg_duration_sec: { $avg: '$duration_sec' },
          },
        },
      ]),
      Call.countDocuments(filterToday).exec(),
      Call.find(filter7)
        .sort({ start_time: -1 })
        .limit(recentLimit)
        .lean()
        .exec(),
    ]);

    const summary = (agg30?.[0] ?? {}) as {
      total_calls?: number;
      booked_calls?: number;
      avg_duration_sec?: number;
    };

    const totalCalls = summary.total_calls ?? 0;
    const bookedCalls = summary.booked_calls ?? 0;
    const avgDurationSec = summary.avg_duration_sec ?? 0;

    const bookingRate =
      totalCalls > 0 ? Math.round((bookedCalls / totalCalls) * 100) : 0;

    const recentCalls = recentDocs.map((doc) =>
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
      range: '30d',
      stats: {
        totalCalls,
        bookedCalls,
        bookingRate,
        avgDuration: fmtDurationMMSS(avgDurationSec),
        todayCalls,
      },
      recentCalls,
    });
  } catch (error) {
    console.error('[overview]', error);
    const message =
      error instanceof Error ? error.message : 'Failed to load overview';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

