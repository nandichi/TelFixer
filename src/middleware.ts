import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { AGENT_LINK_HEADER, shouldAddLinkHeader } from '@/lib/agent/link-headers';
import { shouldNegotiateMarkdown } from '@/lib/agent/markdown-negotiation';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (shouldNegotiateMarkdown(pathname, request)) {
    const url = request.nextUrl.clone();
    url.pathname = '/api/agent/markdown';
    url.searchParams.set('path', pathname + search);
    return NextResponse.rewrite(url);
  }

  const response = await updateSession(request);
  response.headers.set('x-pathname', pathname);

  if (shouldAddLinkHeader(pathname)) {
    const existing = response.headers.get('Link');
    response.headers.set('Link', existing ? `${existing}, ${AGENT_LINK_HEADER}` : AGENT_LINK_HEADER);
    const vary = response.headers.get('Vary');
    response.headers.set('Vary', vary ? `${vary}, Accept` : 'Accept');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
