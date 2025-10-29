import { NextRequest, NextResponse } from "next/server";
import { getHotAnime } from "@/lib/anidb"; // or your actual fetch logic

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  try {
    const all = await getHotAnime(); // or real AniDB search API
    const filtered = all.filter((item: any) =>
      item.title.toLowerCase().includes(q)
    );

    return NextResponse.json({ items: filtered });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
