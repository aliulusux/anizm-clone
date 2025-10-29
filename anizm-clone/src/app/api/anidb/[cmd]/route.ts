import { NextResponse } from "next/server";
import { getHotAnime } from "@/lib/anidb";

export async function GET() {
  try {
    const items = await getHotAnime();
    return NextResponse.json({ items });
  } catch (err) {
    console.error("Failed to fetch trending anime:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
