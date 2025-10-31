import { NextResponse } from "next/server";
export const dynamic = "force-dynamic"; // ✅ Fixes the build error

/**
 * Normalizes Turkish/English slugs.
 */
function normalizeSlug(str = "") {
  return str
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * ✅ Full Turkish-to-Jikan genre map
 * (covers every genre from your footer)
 */
const genreMap = {
  // 🎭 Common genres
  aksiyon: 1,
  macera: 2,
  komedi: 4,
  drama: 8,
  dram: 8,
  fantastik: 10,
  korku: 14,
  romantik: 22,
  romantizm: 22,
  psikolojik: 40,
  bilimkurgu: 24,
  scifi: 24,
  tarihi: 13,
  tarih: 13,
  supergucler: 31,
  dovus: 17,
  mecha: 18,
  muzik: 19,
  okul: 23,
  oyun: 11,
  ecchi: 9,
  harem: 35,
  gizem: 7,
  sliceoflife: 36,
  yasamdankesitler: 36,
  parodi: 20,
  cocuk: 15,
  askeri: 38,
  arabalar: 3,
  polisiye: 39,

  // 🌌 Extras
  uzay: 29,
  vampire: 32,
  vampir: 32,
  samuray: 21,
  sporgucu: 30,
  spor: 30,
  buyu: 16,
  dogauestugucler: 37,
  dogaustugucler: 37,

  // ❤️‍🔥 Demographics
  shounen: 27,
  shoujo: 25,
  seinen: 42,
  josei: 43,

  // 💕 Romance + Relationships
  yaoi: 33,
  yuri: 34,
  shoujoai: 26,
  shounenai: 28,

  // 👻 Misc themes
  okulhayati: 23,
  mucadele: 17,
  superpower: 31,
  savassanatlari: 6,
  parodi: 20,
  oyunbaz: 11,
  cocuklar: 15,
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get("genre");

    if (!genre) {
      return Response.json({ error: "Genre param missing" }, { status: 400 });
    }

    const url = `https://api.jikan.moe/v4/anime?genres=${encodeURIComponent(genre)}&limit=24&order_by=score&sort=desc`;
    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) throw new Error("Failed to fetch genre data");
    const data = await res.json();

    return Response.json({
      items: data.data.map((item) => ({
        mal_id: item.mal_id,
        title: item.title,
        score: item.score,
        images: item.images,
      })),
    });
  } catch (err) {
    console.error("Genre API error:", err);
    return Response.json({ error: "Failed to fetch genre anime" }, { status: 500 });
  }
}
