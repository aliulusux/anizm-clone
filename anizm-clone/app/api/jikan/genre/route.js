export const dynamic = "force-dynamic";

// 🔠 Map Turkish genre names to Jikan numeric genre IDs
const GENRE_MAP = {
  aksiyon: 1,
  macera: 2,
  komedi: 4,
  dram: 8,
  drama: 8,
  büyü: 16,
  fantastik: 10,
  "doğaüstü güçler": 37,
  doğaüstü: 37,
  gizem: 7,
  gerilim: 41,
  korku: 14,
  bilim: 24,
  "bilim kurgu": 24,
  "savaş sanatları": 17,
  askeri: 38,
  romantik: 22,
  romantizm: 22,
  psikolojik: 40,
  spor: 30,
  okul: 23,
  müzik: 19,
  seinen: 42,
  shounen: 27,
  shoujo: 25,
  josei: 43,
  mecha: 18,
  oyun: 11,
  uzay: 29,
  vampir: 32,
  tarih: 13,
  tarihi: 13,
  çocuk: 15,
  parodi: 20,
  polisiye: 39,
  "süper güç": 31,
  "yaşamdan kesitler": 36,
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = decodeURIComponent(searchParams.get("genre") || "")
      .toLowerCase()
      .trim();

    const genreId = GENRE_MAP[raw];

    if (!genreId) {
      console.warn(`⚠️ No Jikan genre found for "${raw}". Showing top anime.`);
      const topRes = await fetch("https://api.jikan.moe/v4/top/anime?limit=24");
      const topData = await topRes.json();
      return Response.json({ items: topData.data });
    }

    const res = await fetch(
      `https://api.jikan.moe/v4/anime?genres=${genreId}&limit=24&order_by=score&sort=desc`
    );

    if (!res.ok) throw new Error("Failed to fetch genre data");

    const data = await res.json();
    return Response.json({ items: data.data });
  } catch (err) {
    console.error("Genre API error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
