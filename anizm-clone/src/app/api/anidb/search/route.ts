import { NextRequest, NextResponse } from "next/server";
import { searchAnimeByTitle } from "@/lib/anidb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ items: [] });
  }

  try {
    const results = await searchAnimeByTitle(q);

    // Fallback to lowercase match if exact title fails
    const unique = results.filter(
      (v: any, i: number, a: any[]) => a.findIndex(t => t.aid === v.aid) === i
    );

    return NextResponse.json({ items: unique });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
