import { NextResponse } from 'next/server';

import { mapRetellToCallDetail } from '@/lib/retell-call-map';
import { retellGetCall } from '@/lib/retell-client';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ callId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { callId } = await context.params;
    if (!callId?.trim()) {
      return NextResponse.json({ error: 'callId required' }, { status: 400 });
    }

    const raw = await retellGetCall(callId);
    const call = mapRetellToCallDetail(raw);

    if (!call) {
      return NextResponse.json({ error: 'Invalid call payload' }, { status: 502 });
    }

    return NextResponse.json({ call });
  } catch (error) {
    console.error('[calls/[callId]]', error);
    if (
      error instanceof Error &&
      error.name === 'RetellNotFound'
    ) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    const message =
      error instanceof Error ? error.message : 'Failed to load call';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
