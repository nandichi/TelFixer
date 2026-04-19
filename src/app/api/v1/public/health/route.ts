import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'telfixer-public-api',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'cache-control': 'public, s-maxage=30, stale-while-revalidate=60',
        'access-control-allow-origin': '*',
      },
    }
  );
}
