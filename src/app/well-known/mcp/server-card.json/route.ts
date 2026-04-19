import { NextResponse } from 'next/server';

const SITE_ORIGIN = 'https://telfixer.nl';

export const dynamic = 'force-static';

// Schema in lijn met SEP-1649 (Server Card draft).
// https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2127
export function GET() {
  const card = {
    $schema: 'https://modelcontextprotocol.io/schemas/draft/server-card.json',
    serverInfo: {
      name: 'telfixer-mcp',
      title: 'TelFixer MCP Server',
      version: '1.0.0',
      description:
        'MCP-server van TelFixer. Biedt agents tools om reparaties aan te melden, status te volgen en productcategorieën op te vragen.',
      vendor: {
        name: 'TelFixer',
        url: SITE_ORIGIN,
      },
    },
    transport: {
      protocol: 'streamable-http',
      endpoint: `${SITE_ORIGIN}/api/mcp`,
    },
    capabilities: {
      tools: { listChanged: false },
      resources: { listChanged: false, subscribe: false },
      prompts: { listChanged: false },
      logging: {},
    },
    authentication: {
      none: {},
    },
    documentation: `${SITE_ORIGIN}/api/v1/public/docs`,
    contact: {
      url: `${SITE_ORIGIN}/contact`,
    },
    termsOfService: `${SITE_ORIGIN}/voorwaarden`,
    privacyPolicy: `${SITE_ORIGIN}/privacy`,
  };

  return new NextResponse(JSON.stringify(card, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'access-control-allow-origin': '*',
    },
  });
}
