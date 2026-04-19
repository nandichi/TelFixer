import { NextResponse } from 'next/server';
import { buildOidcMetadata } from '@/lib/agent/oauth-metadata';

export const dynamic = 'force-static';

export function GET() {
  const meta = buildOidcMetadata();
  if (!meta) {
    return NextResponse.json(
      { error: 'OIDC discovery niet beschikbaar (NEXT_PUBLIC_SUPABASE_URL ontbreekt)' },
      { status: 503 }
    );
  }

  return new NextResponse(JSON.stringify(meta, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'access-control-allow-origin': '*',
    },
  });
}
