import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?genres=${encodeURIComponent(q)}`);
    const data = await res.json();
    return NextResponse.json({ items: data.data || [] });
  } catch (err) {
    console.error("Jikan genre fetch error:", err);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
