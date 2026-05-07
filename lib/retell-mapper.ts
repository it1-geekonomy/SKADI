import { deriveOutcome, type OutcomeSource } from '@/utils/deriveOutcome';

/**
 * Shared Retell -> Skadi call mapping.
 * Used by the manual sync route AND the realtime webhook handler so both
 * paths produce identical DB rows.
 */

export type RetellCallItem = {
  call_id?: string;
  call_type?: string;
  from_number?: string;
  to_number?: string;
  direction?: 'inbound' | 'outbound';
  start_timestamp?: number;
  duration_ms?: number;
  call_analysis?: OutcomeSource['call_analysis'];
  call_summary?: string | null;
};

export function mapSentiment(
  raw: string | null | undefined
): 'Positive' | 'Neutral' | 'Negative' {
  if (raw === 'Positive' || raw === 'Neutral' || raw === 'Negative') {
    return raw;
  }
  return 'Neutral';
}

export type CallUpsertFields = {
  call_id: string;
  call_type: 'phone_call';
  from_number: string;
  to_number: string;
  start_time: Date;
  duration_sec: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  direction: 'inbound' | 'outbound';
  outcome: 'booked' | 'callback' | 'missed';
};

export function toCallFields(item: RetellCallItem): CallUpsertFields | null {
  const callId = item.call_id;
  if (!callId) return null;

  // Web calls are intentionally never stored / displayed.
  if (item.call_type === 'web_call') return null;

  const startMs = item.start_timestamp;
  const start_time =
    typeof startMs === 'number' && !Number.isNaN(startMs)
      ? new Date(startMs)
      : new Date();

  const duration_ms = item.duration_ms ?? 0;
  const duration_sec = Math.max(0, Math.round(duration_ms / 1000));

  const sentiment = mapSentiment(item.call_analysis?.user_sentiment);

  const direction: 'inbound' | 'outbound' =
    item.direction === 'outbound' ? 'outbound' : 'inbound';

  const outcome = deriveOutcome({
    call_analysis: item.call_analysis,
    call_summary: item.call_summary,
  });

  return {
    call_id: callId,
    call_type: 'phone_call',
    from_number: item.from_number ?? '',
    to_number: item.to_number ?? '',
    start_time,
    duration_sec,
    sentiment,
    direction,
    outcome,
  };
}

/** Update payload (excluding `_id` and `created_at`) for upsert operations. */
export function toCallUpdateSet(fields: CallUpsertFields) {
  return {
    call_type: fields.call_type,
    from_number: fields.from_number,
    to_number: fields.to_number,
    start_time: fields.start_time,
    duration_sec: fields.duration_sec,
    sentiment: fields.sentiment,
    direction: fields.direction,
    outcome: fields.outcome,
  };
}
