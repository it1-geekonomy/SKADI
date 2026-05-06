import type { CallOutcome } from '@/utils/deriveOutcome';

export type ApiCallTableRow = {
  call_id: string;
  caller: string;
  time: string;
  duration: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  to: string;
  direction: 'Inbound' | 'Outbound';
  outcome: string;
};

function outcomeKeyToLabel(key: string): string {
  const o = key as CallOutcome;
  if (o === 'booked') return 'Appointment Booked';
  if (o === 'callback') return 'Callback Requested';
  return 'Not Booked';
}

function formatDurationSec(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}

function formatTableTime(startMs: number): string {
  const d = new Date(startMs);
  const now = new Date();
  const sameDay =
    d.getUTCFullYear() === now.getUTCFullYear() &&
    d.getUTCMonth() === now.getUTCMonth() &&
    d.getUTCDate() === now.getUTCDate();

  const timeFmt = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);

  if (sameDay) {
    return timeFmt;
  }

  const dateFmt = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);

  return `${dateFmt}, ${timeFmt}`;
}

export function mapDbCallToTableRow(doc: {
  call_id: string;
  from_number?: string;
  to_number?: string;
  start_time: Date | string;
  duration_sec: number;
  sentiment: string;
  direction: string;
  outcome: string;
}): ApiCallTableRow {
  const startMs =
    doc.start_time instanceof Date
      ? doc.start_time.getTime()
      : new Date(doc.start_time).getTime();

  const sentiment =
    doc.sentiment === 'Positive' ||
    doc.sentiment === 'Neutral' ||
    doc.sentiment === 'Negative'
      ? doc.sentiment
      : 'Neutral';

  return {
    call_id: doc.call_id,
    caller: (doc.from_number ?? '').trim() || '—',
    time: Number.isFinite(startMs) ? formatTableTime(startMs) : '—',
    duration: formatDurationSec(doc.duration_sec ?? 0),
    sentiment,
    to: (doc.to_number ?? '').trim() || '—',
    direction: doc.direction === 'outbound' ? 'Outbound' : 'Inbound',
    outcome: outcomeKeyToLabel(doc.outcome),
  };
}
