import genreMap from "@/lib/genreMap";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // ✅ Support both ?genre= and ?slug=
    const raw = decodeURIComponent(
      searchParams.get("genre") || searchParams.get("slug") || ""
    )
      .toLowerCase()
      .trim();

    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 24;

    // ✅ Lookup genre ID
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
      const result = await res.json();

      console.log("🟢 Jikan response:", {
        genreId,
        raw,
        dataCount: result.data?.length,
        sampleTitle: result.data?.[0]?.title,
      });

      data = result.data || [];
      pagination = result.pagination || {};
    }

    // ✅ Return with consistent key names for GenrePage
    return Response.json({ items: data, pagination });
  } catch (err) {
    console.error("Genre API error:", err);
    return Response.json({ items: [], pagination: {} }, { status: 500 });
  }
}
