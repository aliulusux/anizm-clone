import { NextResponse } from "next/server";

/**
 * Normalizes a genre slug:
 * - Lowercase
 * - Removes Turkish characters
 * - Replaces spaces and punctuation
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
    .replace(/\s+/g, "") // remove spaces
    .replace(/[^a-z0-9]/g, ""); // strip non-latin chars
}

// ✅ map Turkish & English genre slugs to Jikan IDs
const genreMap = {
  aksiyon: 1,
  macera: 2,
  arabalar: 3,
  komedi: 4,
  dram: 8,
  drama: 8,
  fantastik: 10,
  korku: 14,
  magic: 16,
  buyu: 16,
  dovus: 17,
  mecha: 18,
  muzik: 19,
  okul: 23,
  bilimkurgu: 24,
  scifi: 24,
  shoujo: 25,
  shounen: 27,
  spor: 30,
  supergucler: 31,
  dogauestugucler: 37,
  dogaustugucler: 37,
  tarihi: 13,
  tarih: 13,
  harem: 35,
  romantik: 22,
  romantizm: 22,
  psikolojik: 40,
  seinen: 42,
  josei: 43,
  gizem: 7,
  sliceoflife: 36,
  yasamdankesitler: 36,
  vampire: 32,
  vampir: 32,
  polisiye: 39,
  parodi: 20,
  cocuk: 15,
  oyun: 11,
  askeri: 38,
  ecchi: 9,
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get("genre");
    const slug = normalizeSlug(genre);

    const genreId = genreMap[slug];
    if (!genreId) {
      console.warn("Unknown genre:", genre);
      return NextResponse.json({ items: [], error: "Invalid genre" });
    }

    const res = await fetch(
      `https://api.jikan.moe/v4/anime?genres=${genreId}&limit=24`
    );
    if (!res.ok) throw new Error("Jikan fetch failed");

    const data = await res.json();
    return NextResponse.json({ items: data.data || [] });
  } catch (err) {
    console.error("Genre API error:", err);
    return NextResponse.json({ items: [], error: err.message });
  }
}
