import { NextRequest, NextResponse } from 'next/server';

import {
  DASHBOARD_TIME_ZONE,
  startOfDashboardMonthMs,
  startOfPreviousDashboardMonthMs,
} from '@/lib/dashboard-time';
import { connectMongo } from '@/lib/mongodb';
import { getRangeBounds } from '@/lib/retell-call-map';
import { Call } from '@/models/Call';

export const runtime = 'nodejs';

function fmtDurationMMSS(seconds: number) {
  const s = Math.max(0, Math.round(seconds || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

function startOfThisMonth() {
  return startOfDashboardMonthMs();
}

function startOfPrevMonth() {
  return startOfPreviousDashboardMonthMs();
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

    const range = request.nextUrl.searchParams.get('range') ?? '30d';
    const endMs = Date.now();
    const { startMs } =
      range === 'month'
        ? { startMs: startOfThisMonth() }
        : getRangeBounds(range);

    const filter = basePhoneFilter(startMs, endMs);

    const prev = (() => {
      if (range === 'month') {
        const startThis = startOfThisMonth();
        return {
          startPrev: startOfPrevMonth(),
          endPrev: startThis,
        };
      }
      const span = Math.max(1, endMs - startMs);
      return {
        startPrev: startMs - span,
        endPrev: startMs,
      };
    })();
    const filterPrev = basePhoneFilter(prev.startPrev, prev.endPrev);

    const [byDay, byOutcome, byOutcomePrev, byHour, durAgg, durAggPrev] =
      await Promise.all([
      Call.aggregate([
        { $match: filter },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$start_time',
                timezone: DASHBOARD_TIME_ZONE,
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Call.aggregate([
        { $match: filter },
        { $group: { _id: '$outcome', count: { $sum: 1 } } },
      ]),
      Call.aggregate([
        { $match: filterPrev },
        { $group: { _id: '$outcome', count: { $sum: 1 } } },
      ]),
      Call.aggregate([
        { $match: filter },
        {
          $group: {
            _id: {
              $hour: {
                date: '$start_time',
                timezone: DASHBOARD_TIME_ZONE,
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1, _id: 1 } },
        { $limit: 1 },
      ]),
      Call.aggregate([
        { $match: filter },
        { $group: { _id: null, avg_duration_sec: { $avg: '$duration_sec' } } },
      ]),
      Call.aggregate([
        { $match: filterPrev },
        { $group: { _id: null, avg_duration_sec: { $avg: '$duration_sec' } } },
      ]),
    ]);

    const totalCalls = byDay.reduce(
      (sum: number, r: { count: number }) => sum + (r.count ?? 0),
      0
    );

    const outcomeCounts: Record<string, number> = {};
    for (const r of byOutcome as Array<{ _id: string; count: number }>) {
      outcomeCounts[r._id] = r.count ?? 0;
    }

    const booked = outcomeCounts.booked ?? 0;
    const callback = outcomeCounts.callback ?? 0;
    const notBooked = outcomeCounts.missed ?? 0;

    const prevOutcomeCounts: Record<string, number> = {};
    for (const r of byOutcomePrev as Array<{ _id: string; count: number }>) {
      prevOutcomeCounts[r._id] = r.count ?? 0;
    }
    const prevBooked = prevOutcomeCounts.booked ?? 0;
    const prevCallback = prevOutcomeCounts.callback ?? 0;
    const prevNotBooked = prevOutcomeCounts.missed ?? 0;
    const prevTotalCalls = prevBooked + prevCallback + prevNotBooked;

    const peakHour = (byHour?.[0]?._id ?? null) as number | null;
    const peakHourLabel =
      typeof peakHour === 'number'
        ? `${(((peakHour + 11) % 12) + 1).toString()} ${peakHour < 12 ? 'AM' : 'PM'}`
        : '—';

    const avgDurationSec = (durAgg?.[0]?.avg_duration_sec ?? 0) as number;
    const avgDurationSecPrev = (durAggPrev?.[0]?.avg_duration_sec ?? 0) as number;

    return NextResponse.json({
      range,
      totalCalls,
      outcomes: {
        booked,
        callback,
        notBooked,
      },
      previous: {
        totalCalls: prevTotalCalls,
        outcomes: {
          booked: prevBooked,
          callback: prevCallback,
          notBooked: prevNotBooked,
        },
        avgDuration: fmtDurationMMSS(avgDurationSecPrev),
      },
      daily: byDay as Array<{ _id: string; count: number }>,
      peakHour: peakHourLabel,
      avgDuration: fmtDurationMMSS(avgDurationSec),
    });
  } catch (error) {
    console.error('[analytics]', error);
    const message =
      error instanceof Error ? error.message : 'Failed to load analytics';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

