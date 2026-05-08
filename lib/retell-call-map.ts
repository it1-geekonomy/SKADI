import type { CallOutcome } from '@/utils/deriveOutcome';
import { deriveOutcome } from '@/utils/deriveOutcome';
import {
  DASHBOARD_TIME_ZONE,
  formatDashboardDateKey,
  startOfDashboardTodayMs,
} from '@/lib/dashboard-time';

export type TimeRangeKey = '30d' | '7d' | 'today';

export type RetellCallLike = {
  call_id?: string;
  call_type?: string;
  from_number?: string;
  to_number?: string;
  direction?: string;
  start_timestamp?: number;
  duration_ms?: number;
  agent_id?: string;
  agent_name?: string;
  agent_version?: number;
  call_status?: string;
  disconnection_reason?: string;
  call_analysis?: {
    call_successful?: boolean | null;
    call_summary?: string | null;
    user_sentiment?: string | null;
  } | null;
  call_summary?: string | null;
  transcript_object?: RetellUtteranceLike[];
  call_cost?: {
    combined_cost?: number;
  } | null;
  llm_token_usage?: {
    average?: number;
    values?: number[];
  } | null;
  latency?: {
    e2e?: { p50?: number; max?: number; min?: number };
  } | null;
  /** Present on full get-call response when recording is available */
  recording_url?: string | null;
  scrubbed_recording_url?: string | null;
};

type RetellUtteranceLike = {
  role?: string;
  content?: string;
  words?: Array<{ start?: number }>;
};

export function getRangeBounds(
  range: string
): { startMs: number; endMs: number } {
  const endMs = Date.now();
  const day = 24 * 60 * 60 * 1000;
  switch (range) {
    case '30d':
      return { startMs: endMs - 30 * day, endMs };
    case '7d':
      return { startMs: endMs - 7 * day, endMs };
    case 'today': {
      return { startMs: startOfDashboardTodayMs(), endMs };
    }
    default:
      return { startMs: endMs - 7 * day, endMs };
  }
}

export function buildRetellListFilterCriteria(
  startMs: number,
  endMs: number
): Record<string, unknown> {
  const filter: Record<string, unknown> = {
    start_timestamp: {
      type: 'range',
      op: 'bt',
      value: [startMs, endMs],
    },
  };

  const agentId = process.env.RETELL_AGENT_ID?.trim();
  if (agentId) {
    const entry: { agent_id: string; version?: number[] } = {
      agent_id: agentId,
    };
    const ver = process.env.RETELL_AGENT_VERSION?.trim();
    if (ver) {
      const n = Number.parseInt(ver, 10);
      if (Number.isFinite(n)) {
        entry.version = [n];
      }
    }
    filter.agent = [entry];
  }

  return filter;
}

function mapSentiment(
  raw: string | null | undefined
): 'Positive' | 'Neutral' | 'Negative' {
  if (raw === 'Positive' || raw === 'Neutral' || raw === 'Negative') {
    return raw;
  }
  return 'Neutral';
}

function outcomeToLabel(outcome: CallOutcome): string {
  switch (outcome) {
    case 'booked':
      return 'Appointment Booked';
    case 'callback':
      return 'Callback Requested';
    default:
      return 'Not Booked';
  }
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
  const sameDay = formatDashboardDateKey(d) === formatDashboardDateKey(now);

  const timeFmt = new Intl.DateTimeFormat('en-US', {
    timeZone: DASHBOARD_TIME_ZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);

  if (sameDay) {
    return timeFmt;
  }

  const dateFmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: DASHBOARD_TIME_ZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);

  return `${dateFmt}, ${timeFmt}`;
}

function formatModalDate(startMs: number): { date: string; time: string } {
  const d = new Date(startMs);
  const date = new Intl.DateTimeFormat('en-GB', {
    timeZone: DASHBOARD_TIME_ZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: DASHBOARD_TIME_ZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);
  return { date, time };
}

function directionToUi(
  callType: string | undefined,
  direction: string | undefined
): 'Inbound' | 'Outbound' | 'Web' {
  if (callType === 'web_call') {
    return 'Web';
  }
  if (direction === 'outbound') {
    return 'Outbound';
  }
  return 'Inbound';
}

export type CallTableRow = {
  call_id: string;
  caller: string;
  time: string;
  duration: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  to: string;
  direction: 'Inbound' | 'Outbound' | 'Web';
  outcome: string;
  /** For filtering only (not sent to simple table UI) */
  _outcome: CallOutcome;
};

export function mapRetellToTableRow(item: RetellCallLike): CallTableRow | null {
  const callId = item.call_id;
  if (!callId) {
    return null;
  }

  const startMs =
    typeof item.start_timestamp === 'number' ? item.start_timestamp : 0;
  const durationSec = Math.max(
    0,
    Math.round((item.duration_ms ?? 0) / 1000)
  );

  const sentiment = mapSentiment(item.call_analysis?.user_sentiment);
  const outcomeKey = deriveOutcome({
    call_analysis: item.call_analysis,
    call_summary: item.call_summary,
  });

  return {
    call_id: callId,
    caller: item.from_number ?? '—',
    time: startMs ? formatTableTime(startMs) : '—',
    duration: formatDurationSec(durationSec),
    sentiment,
    to: item.to_number ?? '—',
    direction: directionToUi(item.call_type, item.direction),
    outcome: outcomeToLabel(outcomeKey),
    _outcome: outcomeKey,
  };
}

function shortenId(id: string, head = 18, tail = 4): string {
  if (id.length <= head + tail + 1) return id;
  return `${id.slice(0, head)}…${id.slice(-tail)}`;
}

function formatDisconnect(reason?: string): string {
  const raw = reason?.trim();
  if (!raw) return '—';

  const key = raw.toLowerCase();
  const map: Record<string, string> = {
    user_hangup: 'Caller hung up',
    user_hangup_timeout: 'Caller hung up',
    agent_hangup: 'Agent ended the call',
    agent_hangup_timeout: 'Agent ended the call',
    call_timeout: 'Call timed out',
    no_answer: 'No answer',
    busy: 'Line busy',
    network_error: 'Network issue',
    error: 'Call error',
  };
  if (map[key]) return map[key];

  // Fallback: "foo_bar" -> "Foo bar"
  return raw
    .split('_')
    .filter(Boolean)
    .map((p, i) =>
      i === 0
        ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
        : p.toLowerCase()
    )
    .join(' ');
}

function formatCallStatusLabel(raw?: string | null): string {
  if (!raw) return '—';
  const s = raw.toLowerCase();
  if (s === 'ended') return 'Ended';
  if (s === 'ongoing') return 'Ongoing';
  if (s === 'error') return 'Error';
  if (s === 'registered') return 'Registered';
  if (s === 'not_connected') return 'Not connected';
  return raw
    .split('_')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

function pickRecordingUrl(c: RetellCallLike): string | null {
  const a = c.recording_url?.trim();
  if (a) return a;
  const b = c.scrubbed_recording_url?.trim();
  if (b) return b;
  return null;
}

function secToClock(sec: number): string {
  const s = Math.floor(sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

function transcriptFromRetell(
  rows: RetellUtteranceLike[] | undefined
): Array<{ role: 'agent' | 'user'; ts: string; text: string }> {
  if (!rows?.length) {
    return [];
  }

  const out: Array<{ role: 'agent' | 'user'; ts: string; text: string }> = [];

  for (const u of rows) {
    const roleRaw = u.role;
    if (roleRaw !== 'agent' && roleRaw !== 'user') {
      continue;
    }
    const start = u.words?.[0]?.start ?? 0;
    out.push({
      role: roleRaw,
      ts: secToClock(start),
      text: u.content ?? '',
    });
  }

  return out;
}

export type CallDetailPayload = {
  id: string;
  caller: string;
  date: string;
  time: string;
  duration: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  to: string;
  direction: string;
  outcome: string;
  status: string;
  /** Display label from Retell call_status */
  callStatusLabel: string;
  callId: string;
  version: number;
  cost: string;
  tokens: string;
  latency: string;
  disconnect: string;
  summary: string;
  transcript: Array<{ role: 'agent' | 'user'; ts: string; text: string }>;
  agentLine: string;
  /** Signed/public recording URL from Retell, if any */
  recordingUrl: string | null;
};

export function mapRetellToCallDetail(raw: unknown): CallDetailPayload | null {
  const c = raw as RetellCallLike;
  const callId = c.call_id;
  if (!callId) {
    return null;
  }

  const startMs =
    typeof c.start_timestamp === 'number' ? c.start_timestamp : Date.now();
  const { date, time } = formatModalDate(startMs);
  const durationSec = Math.max(0, Math.round((c.duration_ms ?? 0) / 1000));

  const sentiment = mapSentiment(c.call_analysis?.user_sentiment);
  const outcomeKey = deriveOutcome({
    call_analysis: c.call_analysis,
    call_summary: c.call_summary,
  });
  const outcomeLabel = outcomeToLabel(outcomeKey);

  const direction = directionToUi(c.call_type, c.direction);
  const successful = c.call_analysis?.call_successful === true;

  const cents = c.call_cost?.combined_cost;
  const cost =
    typeof cents === 'number'
      ? `$${(cents / 100).toFixed(3)}`
      : '—';

  const avgTok = c.llm_token_usage?.average;
  const tokens =
    typeof avgTok === 'number' && Number.isFinite(avgTok)
      ? String(avgTok)
      : '—';

  const e2e = c.latency?.e2e?.p50 ?? c.latency?.e2e?.max;
  const latency =
    typeof e2e === 'number' && Number.isFinite(e2e)
      ? `${Math.round(e2e)}ms`
      : '—';

  const agentName = c.agent_name?.trim() || 'Agent';
  const agentIdDisp = shortenId(c.agent_id ?? callId, 14, 3);
  const version = typeof c.agent_version === 'number' ? c.agent_version : 0;

  const agentLine = `${agentName} (${agentIdDisp}) · Version: ${version}`;

  return {
    id: callId,
    caller: c.from_number ?? '—',
    date,
    time,
    duration: formatDurationSec(durationSec),
    sentiment,
    to: c.to_number ?? '—',
    direction,
    outcome: outcomeLabel,
    status: successful ? 'Completed' : 'Incomplete',
    callStatusLabel: formatCallStatusLabel(c.call_status),
    callId: shortenId(callId, 22, 3),
    version,
    cost,
    tokens,
    latency,
    disconnect: formatDisconnect(c.disconnection_reason),
    summary: c.call_analysis?.call_summary?.trim() || '—',
    transcript: transcriptFromRetell(c.transcript_object),
    agentLine,
    recordingUrl: pickRecordingUrl(c),
  };
}
