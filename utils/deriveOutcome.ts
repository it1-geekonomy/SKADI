export type CallOutcome = 'booked' | 'callback' | 'missed';

/** Minimal shape from Retell (or our DB) for outcome derivation */
export type OutcomeSource = {
  call_analysis?: {
    call_successful?: boolean | null;
    call_summary?: string | null;
    /** Retell post-call analysis field */
    user_sentiment?: string | null;
  } | null;
  /** Some payloads may surface summary at top level */
  call_summary?: string | null;
};

export function deriveOutcome(callData: OutcomeSource): CallOutcome {
  const analysis = callData.call_analysis;
  if (analysis?.call_successful === true) {
    return 'booked';
  }

  const summary =
    (analysis?.call_summary ?? callData.call_summary ?? '').toLowerCase();
  if (summary.includes('callback')) {
    return 'callback';
  }

  return 'missed';
}
