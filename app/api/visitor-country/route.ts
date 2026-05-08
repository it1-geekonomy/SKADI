import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Returns the visitor country code from hosting/provider headers.
 *
 * On Vercel, `x-vercel-ip-country` is populated from the request IP. Locally
 * this will be missing, so the client falls back to browser locale/timezone.
 */
export async function GET(request: Request) {
  const headers = request.headers;
  const country =
    headers.get('x-vercel-ip-country') ??
    headers.get('cf-ipcountry') ??
    headers.get('x-country-code') ??
    null;

  return NextResponse.json(
    { country: country?.toUpperCase() ?? null },
    {
      headers: {
        'Cache-Control': 'private, no-store',
      },
    }
  );
}
