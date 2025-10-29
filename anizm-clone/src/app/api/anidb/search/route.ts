import { NextRequest, NextResponse } from "next/server";
import { searchAnimeByTitle } from "@/lib/anidb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q) return NextResponse.json({ items: [] });

  try {
    const results = await searchAnimeByTitle(q);
    return NextResponse.json({ items: results });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ error: "Failed to fetch search results" }, { status: 500 });
  }
}
