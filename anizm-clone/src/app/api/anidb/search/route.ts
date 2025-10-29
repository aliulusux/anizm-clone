import { NextRequest, NextResponse } from "next/server";
import { getHotAnime } from "@/lib/anidb"; // adjust this import if needed

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  try {
    const all = await getHotAnime(); // likely returns { items: [...] }
    const items = Array.isArray(all) ? all : all.items || [];

    const filtered = items.filter(
      (item: any) =>
        item.title &&
        item.title.toLowerCase().includes(q)
    );

    return NextResponse.json({ items: filtered });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
