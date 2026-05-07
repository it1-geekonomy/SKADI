import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import { Call } from '@/models/Call';
import {
  toCallFields,
  toCallUpdateSet,
  type RetellCallItem,
} from '@/lib/retell-mapper';
import { emitCallsChanged } from '@/lib/realtime/event-bus';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/retell-webhook
 *
 * Receives realtime events from Retell:
 *   - call_started   (new call established)
 *   - call_ended     (call finished, transcript available)
 *   - call_analyzed  (post-call analysis ready -> outcome / sentiment final)
 *
 * Each event upserts the call into MongoDB and broadcasts a `calls-changed`
 * notification on the realtime bus so connected dashboards refresh
 * automatically without a manual sync.
 *
 * Configure in Retell dashboard:
 *   Webhook URL:   https://<your-host>/api/retell-webhook
 *   Events:        call_started, call_ended, call_analyzed
 *   Secret:        RETELL_WEBHOOK_SECRET  (or fall back to RETELL_API_KEY)
 */

type RetellWebhookPayload = {
  event?: string;
  call?: RetellCallItem;
};

function verifySignature(
  rawBody: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;
  try {
    // Retell signs payloads with HMAC-SHA256(rawBody, secret) -> hex digest.
    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const sigBuf = Buffer.from(signature, 'hex');
    const expBuf = Buffer.from(expected, 'hex');
    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  // Prefer dedicated webhook secret; fall back to API key (matches Retell SDK).
  const secret =
    process.env.RETELL_WEBHOOK_SECRET ?? process.env.RETELL_API_KEY ?? '';
  const enforceSig = process.env.RETELL_WEBHOOK_ENFORCE_SIG === '1';

  if (secret) {
    const sig =
      request.headers.get('x-retell-signature') ??
      request.headers.get('retell-signature');
    const valid = verifySignature(rawBody, sig, secret);
    if (!valid) {
      console.warn('[retell-webhook] invalid or missing signature');
      if (enforceSig) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
      // Otherwise: log and continue (dev-friendly default).
    }
  }

  let payload: RetellWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!payload || typeof payload !== 'object' || !payload.call) {
    // Acknowledge unknown shapes so Retell stops retrying.
    return NextResponse.json({ ok: true, ignored: true });
  }

  const fields = toCallFields(payload.call);
  if (!fields) {
    // Web calls or missing call_id — nothing to store.
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    await connectMongo();

    await Call.updateOne(
      { call_id: fields.call_id },
      {
        $set: toCallUpdateSet(fields),
        $setOnInsert: { created_at: new Date() },
      },
      { upsert: true }
    );

    emitCallsChanged({
      reason: 'webhook',
      call_id: fields.call_id,
      retell_event: payload.event,
    });

    return NextResponse.json({
      ok: true,
      event: payload.event ?? 'unknown',
      call_id: fields.call_id,
    });
  } catch (error) {
    console.error('[retell-webhook] db error', error);
    // Retell will retry on 5xx — return 500 so failed upserts get a chance to recover.
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Retell webhook endpoint. POST events here from Retell.',
  });
}
