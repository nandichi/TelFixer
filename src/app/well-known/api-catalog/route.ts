import { NextResponse } from 'next/server';

const SITE_ORIGIN = 'https://telfixer.nl';

export const dynamic = 'force-static';

export function GET() {
  const body = {
    linkset: [
      {
        anchor: `${SITE_ORIGIN}/api/v1/public`,
        'service-desc': [
          {
            href: `${SITE_ORIGIN}/api/v1/public/openapi.json`,
            type: 'application/openapi+json',
          },
        ],
        'service-doc': [
          {
            href: `${SITE_ORIGIN}/api/v1/public/docs`,
            type: 'text/html',
          },
        ],
        status: [
          {
            href: `${SITE_ORIGIN}/api/v1/public/health`,
            type: 'application/json',
          },
        ],
        'terms-of-service': [
          {
            href: `${SITE_ORIGIN}/voorwaarden`,
            type: 'text/html',
          },
        ],
      },
    ],
  };

  return new NextResponse(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/linkset+json; charset=utf-8',
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'access-control-allow-origin': '*',
    },
  });
}
