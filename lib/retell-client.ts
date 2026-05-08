const RETELL_BASE = 'https://api.retellai.com';

export function requireRetellApiKey(): string {
  const key = process.env.RETELL_API_KEY;
  if (!key) {
    throw new Error('Missing RETELL_API_KEY');
  }
  return key;
}

export async function retellListCalls(
  body: Record<string, unknown>
): Promise<RetellListCallsResponse> {
  const res = await fetch(`${RETELL_BASE}/v3/list-calls`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requireRetellApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Retell list-calls ${res.status}: ${text.slice(0, 400)}`
    );
  }

  return (await res.json()) as RetellListCallsResponse;
}

export async function retellGetCall(callId: string): Promise<unknown> {
  const res = await fetch(
    `${RETELL_BASE}/v2/get-call/${encodeURIComponent(callId)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${requireRetellApiKey()}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    if (res.status === 404) {
      const err = new Error('Call not found');
      err.name = 'RetellNotFound';
      throw err;
    }
    throw new Error(`Retell get-call ${res.status}: ${text.slice(0, 400)}`);
  }

  return res.json();
}

export type RetellListCallsResponse = {
  items?: unknown[];
  has_more?: boolean;
  pagination_key?: string;
};
