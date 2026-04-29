import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Vapi will POST call events, transcripts, tool-call payloads, etc.
  // For now we just accept and acknowledge so you can paste this URL in Vapi.
  try {
    const contentType = request.headers.get('content-type') ?? '';

    // Vapi typically sends JSON; but keep it resilient for early testing.
    const payload =
      contentType.includes('application/json')
        ? await request.json()
        : await request.text();

    console.log('[vapi-webhook] received', {
      at: new Date().toISOString(),
      contentType,
      payload,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[vapi-webhook] error', error);
    // Still return 200 so Vapi doesn't keep retrying while you’re wiring things up.
    return NextResponse.json({ ok: true });
  }
}

export async function GET() {
  // Handy for testing in the browser.
  return NextResponse.json({
    ok: true,
    message: 'Vapi webhook is up. Send POST requests to this URL.',
  });
}

