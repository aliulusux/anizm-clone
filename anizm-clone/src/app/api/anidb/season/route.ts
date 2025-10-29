import { NextResponse } from "next/server";
import { getSeasonalAnime } from "@/lib/anidb";

export async function GET() {
  try {
    const items = await getSeasonalAnime();
    return NextResponse.json({ items });
  } catch (err) {
    console.error("Failed to fetch season anime:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
