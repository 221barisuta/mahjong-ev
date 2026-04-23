import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const logId = request.nextUrl.searchParams.get("log");
  if (!logId) {
    return NextResponse.json({ error: "log parameter required" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://tenhou.net/0/log/?${logId}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch log" }, { status: 502 });
    }
    const text = await res.text();
    return new NextResponse(text, {
      headers: { "Content-Type": "text/xml; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }
}
