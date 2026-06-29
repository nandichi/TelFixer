import { NextRequest, NextResponse } from "next/server";

const BAXX_ORIGIN = "https://telfixer.baxx.app";

export const dynamic = "force-dynamic";

async function proxyBaxxRequest(
  request: NextRequest,
  pathSegments: string[]
): Promise<NextResponse> {
  const targetPath = pathSegments.join("/");
  const targetUrl = new URL(`${BAXX_ORIGIN}/${targetPath}`);

  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const tenantId = request.headers.get("x-tenant-id");
  if (tenantId) {
    headers["X-Tenant-Id"] = tenantId;
  }

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const response = await fetch(targetUrl.toString(), init);
  const body = await response.text();

  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers.get("content-type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyBaxxRequest(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyBaxxRequest(request, path);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Tenant-Id",
    },
  });
}
