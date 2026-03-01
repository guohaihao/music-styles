import { NextRequest, NextResponse } from "next/server";

import { findItunesTrack } from "@/lib/itunes";

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get("title")?.trim() ?? "";
  const performer = request.nextUrl.searchParams.get("performer")?.trim() ?? "";

  if (!title || !performer) {
    return NextResponse.json(
      { error: 'Missing required query parameters "title" and "performer".' },
      { status: 400 }
    );
  }

  try {
    const track = await findItunesTrack(title, performer);
    return NextResponse.json(track);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown iTunes lookup error.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
