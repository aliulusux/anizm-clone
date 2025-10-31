import genreMap from "@/lib/genreMap";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // ✅ Accept both ?genre= and ?slug= (critical fix)
    const raw = decodeURIComponent(
      searchParams.get("genre") || searchParams.get("slug") || ""
    )
      .toLowerCase()
      .trim();

    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 24;

    // ✅ Lookup genre ID from bilingual map
    const genreId = genreMap[raw];
    let data = [];
    let pagination = {};

    if (!genreId) {
      console.warn(`⚠️ No genre found for "${raw}", showing top anime fallback.`);
      const topRes = await fetch(`https://api.jikan.moe/v4/top/anime?limit=${limit}`);
      const topData = await topRes.json();
      data = topData.data || [];
      pagination = topData.pagination || {};
    } else {
      const res = await fetch(
        `https://api.jikan.moe/v4/anime?genres=${genreId}&limit=${limit}&page=${page}&order_by=score&sort=desc`
      );
      const json = await res.json();
      data = json.data || [];
      pagination = json.pagination || {};
    }

    // ✅ Always return items for GenrePage.jsx
    return Response.json({ items: data, pagination });
  } catch (err) {
    console.error("Genre API error:", err);
    return Response.json({ items: [], pagination: {} }, { status: 500 });
  }
}
