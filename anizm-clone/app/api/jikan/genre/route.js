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

    // ✅ Accept both ?genre= and ?slug=
    const raw =
      decodeURIComponent(searchParams.get("genre") || searchParams.get("slug") || "")
        .toLowerCase()
        .trim();

    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 24;

    const genreId = genreMap[raw];

    // 🧩 If no genre match, fallback to top anime
    if (!genreId) {
      console.warn(`⚠️ No genre found for "${raw}", showing top anime fallback.`);
      const topRes = await fetch(`https://api.jikan.moe/v4/top/anime?limit=${limit}`);
      const topData = await topRes.json();

      return Response.json({
        items: topData.data || [],
        pagination: topData.pagination || {},
      });
    }

    // ✅ Fetch from Jikan API
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?genres=${genreId}&limit=${limit}&page=${page}&order_by=score&sort=desc`
    );

    if (!res.ok) throw new Error(`Jikan API failed for genre ID ${genreId}`);

    const data = await res.json();

    // ✅ Return exactly what frontend expects
    return Response.json({
      items: data.data || [],
      pagination: data.pagination || {},
    });
  } catch (err) {
    console.error("Genre API error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
