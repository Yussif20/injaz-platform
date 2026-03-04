/**
 * GET /api/images/proxy?url=<encoded-url>
 * Proxies an external image and returns it as a binary response.
 * Used by the PDF/image download feature to bypass CORS restrictions
 * when html2canvas needs to render cross-origin images.
 */

import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "enjazmo3alem-staging.s3.us-east-005.backblazeb2.com",
  "staging.enjazfile.com",
];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const parsed = new URL(url);
    if (!ALLOWED_HOSTS.includes(parsed.hostname.toLowerCase())) {
      return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
    }

    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: "Upstream fetch failed" }, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to proxy image" }, { status: 500 });
  }
}
