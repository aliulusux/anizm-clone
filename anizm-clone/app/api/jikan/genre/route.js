import genreMap from "@/lib/genreMap";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = decodeURIComponent(searchParams.get("genre") || "")
      .toLowerCase()
      .trim();
    const page = searchParams.get("page") || 1;

    const genreId = genreMap[raw];
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
