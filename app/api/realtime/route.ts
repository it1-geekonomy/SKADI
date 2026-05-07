import { realtimeBus, type RealtimeEvent } from '@/lib/realtime/event-bus';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Long-lived SSE connection — needs to stay open well beyond the default
// 10s function timeout. Adjust per hosting plan if needed.
export const maxDuration = 300;

/**
 * GET /api/realtime
 *
 * Server-Sent Events stream that the dashboard subscribes to. Each connected
 * tab receives a `calls-changed` event whenever the webhook upserts a call
 * (or a manual sync runs). The client hook reacts by invalidating RTK Query
 * caches so all visible pages refresh automatically.
 *
 * Format: standard SSE
 *   - `event: <name>\ndata: <json>\n\n`
 *   - keepalive comments every 25s to defeat proxy idle timeouts.
 */
export async function GET(request: Request) {
  const encoder = new TextEncoder();

  let onEvent: ((evt: RealtimeEvent) => void) | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;
  let cleanedUp = false;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (chunk: string) => {
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          // Controller closed (client disconnected) — swallow.
        }
      };

      // Initial handshake.
      send(`: connected\n\n`);
      send(
        `event: hello\ndata: ${JSON.stringify({
          at: new Date().toISOString(),
        })}\n\n`
      );

      onEvent = (evt) => {
        send(`event: ${evt.type}\ndata: ${JSON.stringify(evt)}\n\n`);
      };
      realtimeBus.on('event', onEvent);

      heartbeat = setInterval(() => {
        send(`: keepalive ${Date.now()}\n\n`);
      }, 25_000);
    },
    cancel() {
      cleanup();
    },
  });

  function cleanup() {
    if (cleanedUp) return;
    cleanedUp = true;
    if (onEvent) {
      realtimeBus.off('event', onEvent);
      onEvent = null;
    }
    if (heartbeat) {
      clearInterval(heartbeat);
      heartbeat = null;
    }
  }

  // Belt-and-braces: also clean up when the request is aborted.
  request.signal.addEventListener('abort', cleanup);

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      // Disable buffering on Nginx-style proxies.
      'X-Accel-Buffering': 'no',
    },
  });
}
