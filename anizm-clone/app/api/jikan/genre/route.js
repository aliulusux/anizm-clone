import genreMap from "@/lib/genreMap";

export const dynamic = "force-dynamic";

const translationMap = {
  aksiyon: "action",
  macera: "adventure",
  komedi: "comedy",
  dram: "drama",
  fantastik: "fantasy",
  korku: "horror",
  romantizm: "romance",
  "bilim kurgu": "sci-fi",
  "doğaüstü güçler": "supernatural",
  "yaşamdan kesitler":"slice-of-life",
  büyü:"magic",
  askeri:"military",
  gizem:"mystery",
  spor:"sport",
  tarihi:"historical",
  müzik:"music",
  oyun:"game",
  vampir:"vampire",
  parodi:"pardoy",
  okul:"",
  gerilim: "thriller",
  çocuk: "kodomo",
  polisiye: "detective"
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const rawGenre = decodeURIComponent(searchParams.get("genre") || "")
      .toLowerCase()
      .trim();

    const page = searchParams.get("page") || 1;

    const translated = translationMap[rawGenre] || rawGenre;
    const genreId = genreMap[translated];
    if (!genreId) {
      console.warn(`⚠️ No genre found for "${raw}", showing top anime fallback.`);
      const topRes = await fetch(`https://api.jikan.moe/v4/top/anime?limit=24`);
      const topData = await topRes.json();
      return Response.json({ data: topData.data, pagination: topData.pagination });
    }

    const res = await fetch(
      `https://api.jikan.moe/v4/anime?genres=${genreId}&limit=24&page=${page}&order_by=score&sort=desc`
    );
    const data = await res.json();
    return Response.json({ data: data.data, pagination: data.pagination });
  } catch (err) {
    console.error("Genre API error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
