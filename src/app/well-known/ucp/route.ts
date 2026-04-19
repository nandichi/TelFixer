import { NextResponse } from 'next/server';

const SITE_ORIGIN = 'https://telfixer.nl';

export const dynamic = 'force-static';

export function GET() {
  const body = {
    protocol: { name: 'ucp', version: '0.1' },
    issuer: SITE_ORIGIN,
    services: ['catalog', 'order_tracking', 'repair_request'],
    capabilities: {
      currencies: ['EUR'],
      payment_methods: ['mollie', 'ideal'],
      languages: ['nl'],
      regions: ['NL', 'BE'],
    },
    endpoints: {
      catalog: `${SITE_ORIGIN}/producten`,
      checkout: `${SITE_ORIGIN}/api/checkout/create-payment`,
      tracking: `${SITE_ORIGIN}/api/v1/public/tracking`,
      repair_request: `${SITE_ORIGIN}/api/v1/public/repair-request`,
      service_desc: `${SITE_ORIGIN}/api/v1/public/openapi.json`,
      service_doc: `${SITE_ORIGIN}/api/v1/public/docs`,
    },
    contact: {
      url: `${SITE_ORIGIN}/contact`,
    },
    documentation: 'https://ucp.dev/specification/overview/',
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
