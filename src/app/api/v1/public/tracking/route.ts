import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
  'access-control-allow-headers': 'content-type, authorization',
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ref = (url.searchParams.get('ref') || '').trim();

  if (!ref) {
    return NextResponse.json(
      { error: 'Referentienummer ontbreekt' },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const upstream = new URL('/api/tracking', url.origin);
  upstream.searchParams.set('ref', ref);

  const res = await fetch(upstream, { cache: 'no-store' });
  const body = await res.text();

  return new NextResponse(body, {
    status: res.status,
    headers: {
      'content-type': res.headers.get('content-type') || 'application/json',
      ...CORS_HEADERS,
    },
  });
}
