import { EventEmitter } from 'node:events';

/**
 * Process-wide pub/sub bus for realtime events.
 *
 * Bridges incoming webhook handlers to long-lived SSE clients within the
 * same Node process. We persist the singleton on `globalThis` so it survives
 * Next.js dev hot-reloads (otherwise each HMR cycle would create a fresh
 * emitter and orphan existing SSE subscribers).
 *
 * NOTE: this works for single-instance deployments. For multi-instance
 * (e.g. several Vercel server regions), swap this for Redis pub/sub or
 * an external message broker so all instances share the stream.
 */

declare global {
  // eslint-disable-next-line no-var
  var __skadiRealtimeBus: EventEmitter | undefined;
}

const bus = globalThis.__skadiRealtimeBus ?? new EventEmitter();
// Each browser tab opens its own SSE -> many listeners are expected.
bus.setMaxListeners(0);

if (!globalThis.__skadiRealtimeBus) {
  globalThis.__skadiRealtimeBus = bus;
}

export const realtimeBus = bus;

export type RealtimeEvent = {
  type: 'calls-changed';
  reason: 'webhook' | 'sync';
  call_id?: string;
  retell_event?: string;
  at: string;
};

export function emitCallsChanged(
  payload: Omit<RealtimeEvent, 'type' | 'at'>
): void {
  const event: RealtimeEvent = {
    type: 'calls-changed',
    at: new Date().toISOString(),
    ...payload,
  };
  bus.emit('event', event);
}
