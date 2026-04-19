import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const html = `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TelFixer Public API \u2013 Documentatie</title>
  <link rel="icon" href="/icon.png" />
  <style>body{margin:0;height:100vh}</style>
</head>
<body>
  <script id="api-reference" data-url="/api/v1/public/openapi.json"></script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`;

export function GET() {
  return new NextResponse(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
