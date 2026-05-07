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

const RETELL_BASE = 'https://api.retellai.com';

type RetellListResponse = {
  items?: unknown[];
  has_more?: boolean;
  pagination_key?: string;
};

async function fetchRetellPage(
  apiKey: string,
  body: Record<string, unknown>
): Promise<RetellListResponse> {
  const res = await fetch(`${RETELL_BASE}/v3/list-calls`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Retell list-calls failed: ${res.status} ${res.statusText} — ${text.slice(0, 500)}`
    );
  }

  return (await res.json()) as RetellListResponse;
}

export async function POST() {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing RETELL_API_KEY' },
      { status: 500 }
    );
  }

  try {
    await connectMongo();

    const removedWeb = await Call.deleteMany({ call_type: 'web_call' });

    const pageSize = 1000;
    let pagination_key: string | undefined;
    let retellItems = 0;
    let skippedWeb = 0;
    let skippedInvalid = 0;

    let inserted = 0;
    let updated = 0;
    let unchanged = 0;
    let pages = 0;
    const maxPages = 500;

    do {
      const payload: Record<string, unknown> = {
        limit: pageSize,
        sort_order: 'descending',
      };
      if (pagination_key) {
        payload.pagination_key = pagination_key;
      }

      const page = await fetchRetellPage(apiKey, payload);
      const items = (page.items ?? []) as RetellCallItem[];
      retellItems += items.length;
      for (const it of items) {
        if (it.call_type === 'web_call') skippedWeb += 1;
        if (!it.call_id) skippedInvalid += 1;
      }

      const ops = items
        .map((item) => {
          const fields = toCallFields(item);
          if (!fields) return null;
          return {
            updateOne: {
              filter: { call_id: fields.call_id },
              update: {
                $set: toCallUpdateSet(fields),
                $setOnInsert: { created_at: new Date() },
              },
              upsert: true,
            },
          };
        })
        .filter((op): op is NonNullable<typeof op> => op !== null);

      if (ops.length > 0) {
        const res = await Call.bulkWrite(ops, { ordered: false });
        inserted += res.upsertedCount ?? 0;
        const matchedExisting = res.matchedCount ?? 0;
        const modifiedExisting = res.modifiedCount ?? 0;
        updated += modifiedExisting;
        unchanged += Math.max(0, matchedExisting - modifiedExisting);
      }

      pages += 1;
      pagination_key = page.pagination_key;
      const hasMore = Boolean(page.has_more);

      if (!hasMore || !pagination_key || pages >= maxPages) {
        break;
      }
    } while (true);

    // Notify any other connected dashboards so they refresh too.
    if (inserted > 0 || updated > 0 || (removedWeb.deletedCount ?? 0) > 0) {
      emitCallsChanged({ reason: 'sync' });
    }

    return NextResponse.json({
      ok: true,
      fetched: retellItems,
      inserted,
      updated,
      unchanged,
      skipped_web_calls: skippedWeb,
      skipped_invalid: skippedInvalid,
      pages,
      removed_web_calls: removedWeb.deletedCount,
    });
  } catch (error) {
    console.error('[sync-calls]', error);
    const message = error instanceof Error ? error.message : 'Sync failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
