export const dynamic = "force-dynamic";
import genreMap from "@/lib/genreMap";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = decodeURIComponent(searchParams.get("genre") || "")
      .toLowerCase()
      .trim();

    const genreId = genreMap[raw];

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

    // 🧩 FIX: Ensure every image URL starts with https://
    const fixedData = (data.data || []).map((anime) => {
      const img = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
      const secureImg =
        img?.startsWith("http") ? img : `https:${img || ""}`;
      return {
        ...anime,
        images: {
          ...anime.images,
          jpg: {
            ...anime.images?.jpg,
            large_image_url: secureImg,
            image_url: secureImg,
          },
        },
      };
    });

    return Response.json({ items: fixedData });
  } catch (err) {
    console.error("Genre API error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
