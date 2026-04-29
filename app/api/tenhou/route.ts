import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/xml,application/xml,application/xhtml+xml,text/html;q=0.9,*/*;q=0.8",
  "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
  Referer: "https://tenhou.net/",
};

export async function GET(request: NextRequest) {
  const logId = request.nextUrl.searchParams.get("log");
  if (!logId) {
    return NextResponse.json(
      { error: "log parameter required" },
      { status: 400 },
    );
  }

  try {
    const upstream = `https://tenhou.net/0/log/?${logId}`;
    const res = await fetch(upstream, { headers: BROWSER_HEADERS });
    if (!res.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch log",
          status: res.status,
          statusText: res.statusText,
          upstream,
        },
        { status: 502 },
      );
    }
    const text = await res.text();
    return new NextResponse(text, {
      headers: { "Content-Type": "text/xml; charset=utf-8" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Fetch error", message: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
