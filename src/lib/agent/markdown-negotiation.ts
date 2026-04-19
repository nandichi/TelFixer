/**
 * Helpers voor Markdown-onderhandeling op basis van de Accept header.
 * RFC 9110 quality value parsing, met text/markdown als gewenste type.
 */

const INTERNAL_BYPASS_HEADER = 'x-agent-md-internal';

export const MARKDOWN_INTERNAL_HEADER = INTERNAL_BYPASS_HEADER;

type AcceptEntry = { type: string; q: number };

function parseAccept(header: string | null): AcceptEntry[] {
  if (!header) return [];
  return header
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [type, ...params] = entry.split(';').map((p) => p.trim());
      let q = 1;
      for (const param of params) {
        const [k, v] = param.split('=').map((p) => p.trim());
        if (k === 'q') {
          const parsed = Number(v);
          if (Number.isFinite(parsed)) q = parsed;
        }
      }
      return { type: type.toLowerCase(), q };
    });
}

export function prefersMarkdown(acceptHeader: string | null): boolean {
  const entries = parseAccept(acceptHeader);
  if (!entries.length) return false;

  const md = entries.find((e) => e.type === 'text/markdown');
  if (!md || md.q === 0) return false;

  const html = entries.find((e) => e.type === 'text/html');
  const xhtml = entries.find((e) => e.type === 'application/xhtml+xml');

  const htmlQ = Math.max(html?.q ?? 0, xhtml?.q ?? 0);

  // Markdown is preferred only when its q-value is higher than HTML.
  // If a browser sends Accept: text/html,application/xhtml+xml,...,*/*;q=0.8
  // we must stay HTML. Only explicit agent requests trigger conversion.
  return md.q > htmlQ;
}

export function shouldNegotiateMarkdown(
  pathname: string,
  request: { headers: { get: (name: string) => string | null }; method: string }
): boolean {
  if (request.method !== 'GET' && request.method !== 'HEAD') return false;
  if (request.headers.get(INTERNAL_BYPASS_HEADER)) return false;
  if (pathname.startsWith('/_next')) return false;
  if (pathname.startsWith('/api')) return false;
  if (pathname.startsWith('/.well-known')) return false;
  if (/\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff|woff2|ttf|json)$/i.test(pathname)) return false;
  return prefersMarkdown(request.headers.get('accept'));
}
