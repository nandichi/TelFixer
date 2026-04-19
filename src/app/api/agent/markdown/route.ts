import { NextResponse } from 'next/server';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import { MARKDOWN_INTERNAL_HEADER } from '@/lib/agent/markdown-negotiation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SAFE_PATH_RE = /^\/(?!api\/agent\/markdown)[\w\-./?=&%+~,!@#$*:;'"()[\]{}|^`]*$/;

function extractMain(html: string): string {
  const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
  if (mainMatch) return mainMatch[0];
  const bodyMatch = html.match(/<body[\s\S]*?<\/body>/i);
  if (bodyMatch) return bodyMatch[0];
  return html;
}

function extractTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return null;
  return m[1].trim().replace(/\s+/g, ' ');
}

function countTokensApprox(text: string): number {
  // Crude approximation: ~4 chars per token (OpenAI guideline).
  return Math.ceil(text.length / 4);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedPath = url.searchParams.get('path') || '/';

  if (!requestedPath.startsWith('/') || !SAFE_PATH_RE.test(requestedPath)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  const origin = url.origin;
  const target = origin + requestedPath;

  let html: string;
  try {
    const res = await fetch(target, {
      headers: {
        accept: 'text/html',
        [MARKDOWN_INTERNAL_HEADER]: '1',
        'user-agent': 'TelFixer-Agent-Markdown/1.0',
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      return new NextResponse(`Upstream returned ${res.status}`, {
        status: res.status,
      });
    }
    html = await res.text();
  } catch (err) {
    console.error('Markdown negotiation upstream fetch failed:', err);
    return NextResponse.json(
      { error: 'Failed to fetch upstream HTML' },
      { status: 502 }
    );
  }

  const title = extractTitle(html);
  const main = extractMain(html);

  const md = NodeHtmlMarkdown.translate(main, {
    bulletMarker: '-',
    keepDataImages: false,
    useLinkReferenceDefinitions: false,
  });

  const composed = title ? `# ${title}\n\n${md}` : md;
  const tokens = countTokensApprox(composed);

  return new NextResponse(composed, {
    status: 200,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'x-markdown-tokens': String(tokens),
      'cache-control': 'public, s-maxage=300, stale-while-revalidate=86400',
      vary: 'Accept',
    },
  });
}
