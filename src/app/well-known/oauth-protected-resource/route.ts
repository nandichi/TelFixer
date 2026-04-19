import { NextResponse } from 'next/server';

const SITE_ORIGIN = 'https://telfixer.nl';

export const dynamic = 'force-static';

export function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const authIssuer = supabaseUrl ? `${supabaseUrl.replace(/\/$/, '')}/auth/v1` : `${SITE_ORIGIN}/.well-known/openid-configuration`;

  const body = {
    resource: `${SITE_ORIGIN}/api/v1/public`,
    authorization_servers: [authIssuer],
    scopes_supported: ['openid', 'profile', 'email'],
    bearer_methods_supported: ['header'],
    resource_documentation: `${SITE_ORIGIN}/api/v1/public/docs`,
    resource_signing_alg_values_supported: ['RS256', 'HS256'],
    resource_name: 'TelFixer Public API',
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
