// /app/api/jikan/genre/route.js
import { NextResponse } from "next/server";

/**
 * Maps both Turkish and English genre names to Jikan genre IDs.
 * If a Turkish genre is clicked, it’s automatically translated to English.
 * Example: "büyü" -> "Magic" -> genreId = 16
 */
const genreMap = {
  // Turkish → Jikan
  aksiyon: 1,
  macera: 2,
  arabalar: 3,
  komedi: 4,
  drama: 8,
  dram: 8,
  büyü: 16, // Magic
  dövüş: 17, // Martial Arts
  fantastik: 10,
  romantik: 22,
  korku: 14,
  müzik: 19,
  okul: 23,
  spor: 30,
  psikolojik: 40,
  bilim: 24, // Sci-Fi
  bilimkurgu: 24,
  savaş: 38,
  doğaüstü: 37,
  tarih: 13,
  tarihi: 13,
  mecha: 18,
  seinen: 42,
  shounen: 27,
  shoujo: 25,
  josei: 43,
  gizem: 7,
  harem: 35,
  komediromantik: 22,
  oyun: 11,
  sliceoflife: 36,
  yaşamdan: 36,
  vampir: 32,
  polis: 39,
  polisiye: 39,

  // English → Jikan (fallback)
  action: 1,
  adventure: 2,
  cars: 3,
  comedy: 4,
  drama_en: 8,
  fantasy: 10,
  magic: 16,
  martialarts: 17,
  mystery: 7,
  horror: 14,
  music: 19,
  school: 23,
  sports: 30,
  psychological: 40,
  scifi: 24,
  military: 38,
  supernatural: 37,
  historical: 13,
  mecha_en: 18,
  seinen_en: 42,
  shounen_en: 27,
  shoujo_en: 25,
  josei_en: 43,
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get("genre");
    const slug = genre?.toLowerCase();

    const genreId = genreMap[slug];
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
