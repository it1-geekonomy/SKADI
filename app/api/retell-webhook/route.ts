import { NextResponse } from 'next/server';
import { Retell } from 'retell-sdk';
import { connectMongo } from '@/lib/mongodb';
import { retellGetCall } from '@/lib/retell-client';
import { Call } from '@/models/Call';
import {
  toCallFields,
  toCallUpdateSet,
  type RetellCallItem,
} from '@/lib/retell-mapper';
import { emitCallsChanged } from '@/lib/realtime/event-bus';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const GET_CALL_RETRY_DELAYS_MS = [0, 750, 1500] as const;

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
 *   Signature:     Retell signs with RETELL_API_KEY (official SDK verify)
 */

type RetellWebhookPayload = {
  event?: string;
  event_type?: string;
  call?: RetellCallItem;
  data?: unknown;
  call_id?: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function asRetellCallItem(v: unknown): RetellCallItem | null {
  if (!isRecord(v)) return null;
  return v as RetellCallItem;
}

function getStringField(obj: unknown, key: string): string | null {
  if (!isRecord(obj)) return null;
  const value = obj[key];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function extractWebhookCall(payload: RetellWebhookPayload): RetellCallItem | null {
  const directCall = asRetellCallItem(payload.call);
  if (directCall) return directCall;

  if (isRecord(payload.data)) {
    const nestedCall = asRetellCallItem(payload.data.call);
    if (nestedCall) return nestedCall;
    return asRetellCallItem(payload.data);
  }

  return null;
}

function extractCallId(
  payload: RetellWebhookPayload,
  call: RetellCallItem | null
) {
  return (
    call?.call_id ??
    getStringField(payload, 'call_id') ??
    getStringField(payload.data, 'call_id') ??
    getStringField(payload.data, 'id')
  );
}

function getEventName(payload: RetellWebhookPayload) {
  return payload.event ?? payload.event_type ?? 'unknown';
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retellGetCallWithRetry(callId: string): Promise<RetellCallItem> {
  let lastError: unknown;

  for (const delay of GET_CALL_RETRY_DELAYS_MS) {
    if (delay > 0) {
      await wait(delay);
    }

    try {
      return (await retellGetCall(callId)) as RetellCallItem;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

function hasDisplayablePhoneNumber(fields: ReturnType<typeof toCallFields>) {
  if (!fields) return false;
  return fields.from_number.trim() !== '' || fields.to_number.trim() !== '';
}

export async function POST(request: Request) {
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  // Retell's official docs verify x-retell-signature with RETELL_API_KEY.
  // Do not use RETELL_WEBHOOK_SECRET here; that caused valid Retell events to
  // be rejected when signature enforcement was enabled.
  const apiKey = process.env.RETELL_API_KEY ?? '';
  const enforceSig = process.env.RETELL_WEBHOOK_ENFORCE_SIG === '1';

  if (apiKey) {
    const sig =
      request.headers.get('x-retell-signature') ??
      request.headers.get('X-Retell-Signature');
    const valid =
      typeof sig === 'string' && Retell.verify(rawBody, apiKey, sig);
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

  try {
    const webhookCall = extractWebhookCall(payload);
    const callId = extractCallId(payload, webhookCall);

    if (!callId) {
      console.warn('[retell-webhook] ignored payload without call_id', {
        event: getEventName(payload),
        keys: Object.keys(payload),
      });
      return NextResponse.json({ ok: true, ignored: true });
    }

    let retellCall: RetellCallItem | null = null;
    try {
      // Fetch canonical call data. This makes webhook sync reliable for both
      // full call payloads and lightweight call_id-only payloads.
      retellCall = await retellGetCallWithRetry(callId);
    } catch (error) {
      console.warn('[retell-webhook] get-call failed; using webhook payload', {
        call_id: callId,
        error: error instanceof Error ? error.message : 'unknown',
      });
    }

    const candidate = retellCall ?? webhookCall;
    const fields = candidate ? toCallFields(candidate) : null;

    if (!fields) {
      if (candidate?.call_type === 'web_call') {
        return NextResponse.json({
          ok: true,
          skipped: true,
          reason: 'web_call',
          event: getEventName(payload),
          call_id: callId,
        });
      }

      console.warn('[retell-webhook] call data unavailable; requesting retry', {
        event: getEventName(payload),
        call_id: callId,
        source: retellCall ? 'retell_get_call' : 'webhook_payload',
      });
      return NextResponse.json(
        { error: 'Call data unavailable', call_id: callId },
        { status: 500 }
      );
    }

    if (!hasDisplayablePhoneNumber(fields)) {
      console.warn('[retell-webhook] call has no phone numbers; requesting retry', {
        event: getEventName(payload),
        call_id: callId,
        source: retellCall ? 'retell_get_call' : 'webhook_payload',
      });
      return NextResponse.json(
        { error: 'Call phone numbers unavailable', call_id: callId },
        { status: 500 }
      );
    }

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
      retell_event: getEventName(payload),
    });

    return NextResponse.json({
      ok: true,
      event: getEventName(payload),
      call_id: fields.call_id,
      source: retellCall ? 'retell_get_call' : 'webhook_payload',
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
