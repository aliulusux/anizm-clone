import { NextRequest, NextResponse } from "next/server";
import { getAnimeById } from "@/lib/anidb";

export async function GET(_: NextRequest, { params }: { params: { aid: string } }) {
  try {
    const anime = await getAnimeById(params.aid);
    if (!anime) return NextResponse.json({ error: "Anime not found" }, { status: 404 });
    return NextResponse.json(anime);
  } catch (err) {
    console.error("Error fetching anime:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
