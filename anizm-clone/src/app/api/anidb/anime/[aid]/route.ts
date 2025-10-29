import { NextResponse } from "next/server";
import { getAnimeById } from "@/lib/anidb";

export async function GET(_: Request, { params }: { params: { aid: string } }) {
  try {
    const anime = await getAnimeById(params.aid);
    if (!anime) {
      return NextResponse.json({ error: "Anime not found" }, { status: 404 });
    }
    return NextResponse.json(anime);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
