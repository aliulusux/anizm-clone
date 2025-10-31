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
  süpergüçler: 31,
  dovus: 17,
  mecha: 18,
  müzik: 19,
  okul: 23,
  oyun: 11,
  ecchi: 9,
  harem: 35,
  gizem: 7,
  sliceoflife: 36,
  yasamdankesitler: 36,
  parodi: 20,
  çocuk: 15,
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
  büyü: 16,
  doğaüstügüçler: 37,

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
  mücadele: 17,
  superpower: 31,
  savaşsanatlari: 6,
  parodi: 20,
  oyunbaz: 11,
  çocuklar: 15,
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get("genre")?.toLowerCase() || "";

    const genreId = GENRE_MAP[raw];

    // 🧠 Fallback if no match found
    if (!genreId) {
      console.warn(`⚠️ No anime found for "${raw}", loading top anime fallback...`);
      const topRes = await fetch("https://api.jikan.moe/v4/top/anime?limit=24");
      const topData = await topRes.json();
      return Response.json({ items: topData.data });
    }

    // ✅ Fetch by ID
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?genres=${genreId}&limit=24&order_by=score&sort=desc`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) throw new Error("Genre fetch failed");

    const data = await res.json();
    return Response.json({ items: data.data });
  } catch (err) {
    console.error("Genre API error:", err);
    return Response.json({ error: "Failed to fetch genre anime" }, { status: 500 });
  }
}
