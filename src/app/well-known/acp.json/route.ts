import { NextResponse } from 'next/server';

const SITE_ORIGIN = 'https://telfixer.nl';

export const dynamic = 'force-static';

export function GET() {
  const body = {
    protocol: { name: 'acp', version: '2025-09-12' },
    api_base_url: `${SITE_ORIGIN}/api/v1/public`,
    transports: ['https'],
    capabilities: {
      services: ['product_feed', 'order_tracking', 'repair_request'],
      currencies: ['EUR'],
      languages: ['nl'],
    },
    documentation: {
      service_desc: `${SITE_ORIGIN}/api/v1/public/openapi.json`,
      service_doc: `${SITE_ORIGIN}/api/v1/public/docs`,
      specification: 'https://agenticcommerce.dev',
    },
    contact: {
      url: `${SITE_ORIGIN}/contact`,
    },
  };

  return new NextResponse(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'access-control-allow-origin': '*',
    },
  });
}
