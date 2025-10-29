import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

/** Main details */
async function fetchAnime(id: string) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    if (!res.ok) throw new Error("Failed to fetch anime details");
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("fetchAnime error:", err);
    return null;
  }
}

/** Episodes (Jikan is paginated). We’ll pull up to ~100 episodes server-side. */
async function fetchEpisodes(id: string) {
  const episodes: any[] = [];
  let page = 1;
  try {
    // hard cap to avoid very long builds; increase if you want more
    while (page <= 4) {
      const res = await fetch(
        `https://api.jikan.moe/v4/anime/${id}/episodes?page=${page}`
      );
      if (!res.ok) break;
      const data = await res.json();
      episodes.push(...(data.data || []));
      if (!data.pagination?.has_next_page) break;
      page++;
    }
  } catch (err) {
    console.error("fetchEpisodes error:", err);
  }
  return episodes;
}

/** Related anime + covers: relations API doesn’t include images, so fetch details for each MAL id. */
async function fetchRelatedWithCovers(id: string) {
  try {
    const relRes = await fetch(`https://api.jikan.moe/v4/anime/${id}/relations`);
    if (!relRes.ok) throw new Error("Failed to fetch related anime");
    const relJson = await relRes.json();
    const ids: number[] =
      relJson.data
        ?.flatMap((r: any) =
