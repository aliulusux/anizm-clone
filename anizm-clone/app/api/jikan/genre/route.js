import genreMap from "@/lib/genreMap";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // ✅ Accept both ?genre= and ?slug=
    const raw = decodeURIComponent(
      searchParams.get("genre") || searchParams.get("slug") || ""
    )
      .toLowerCase()
      .trim();

    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 24;

    // ✅ Handle genre mapping
    const genreId = genreMap[raw];
    if (!genreId) {
      console.warn(`⚠️ No genre found for "${raw}", showing top anime fallback.`);
      const topRes = await fetch(`https://api.jikan.moe/v4/top/anime?limit=${limit}`);
      const topData = await topRes.json();
      return Response.json({
        items: topData.data || [],
        pagination: topData.pagination || {},
        source: "fallback-top",
      });
    }

    // ✅ Fetch anime by genre
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?genres=${genreId}&limit=${limit}&page=${page}&order_by=score&sort=desc`
    );

    if (!res.ok) {
      throw new Error(`Jikan API returned ${res.status}`);
    }

    const data = await res.json();

    // ✅ Unified response shape
    return Response.json({
      items: data.data || [],
      pagination: data.pagination || {},
      source: "genre",
    });
  } catch (err) {
    console.error("❌ Genre API error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
