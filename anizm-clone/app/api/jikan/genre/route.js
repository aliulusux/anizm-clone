// /app/api/jikan/genre/route.js
import { NextResponse } from "next/server";

// Map Turkish genre slugs to Jikan genre IDs
const genreMap = {
  aksiyon: 1,
  macera: 2,
  arabalar: 3,
  komedi: 4,
  "drama": 8,
  "dram": 8,
  dövüş: 17,
  fantastik: 10,
  romantik: 22,
  korku: 14,
  müzik: 19,
  okul: 23,
  spor: 30,
  psikolojik: 40,
  bilim: 24,
  savaş: 38,
  doğaüstü: 37,
  "slice-of-life": 36,
  tarihi: 13,
  mecha: 18,
  seinen: 42,
  shounen: 27,
  shoujo: 25,
  josei: 43,
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get("genre");

    const genreId = genreMap[genre?.toLowerCase()];
    if (!genreId)
      return NextResponse.json({ items: [], error: "Invalid genre" });

    const res = await fetch(
      `https://api.jikan.moe/v4/anime?genres=${genreId}&limit=24`
    );

    if (!res.ok) throw new Error("Failed to fetch Jikan data");

    const data = await res.json();
    return NextResponse.json({ items: data.data || [] });
  } catch (err) {
    console.error("Jikan genre fetch error:", err);
    return NextResponse.json({ items: [], error: err.message });
  }
}
