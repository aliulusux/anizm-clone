export const revalidate = 300; // 5 minutes for server components pages

const base = process.env.NEXT_PUBLIC_BASE_URL || "";

/** Top anime (home) */
export async function getTopAnime(limit = 24) {
  const res = await fetch(`${base}/api/jikan/top?limit=${limit}`, { next: { revalidate } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

/** Search */
export async function searchAnime(q, page = 1) {
  const res = await fetch(`${base}/api/jikan/search?q=${encodeURIComponent(q)}&page=${page}`, { next: { revalidate } });
  if (!res.ok) return { items: [], pagination: null };
  return res.json();
}

/** Full anime details and recommendations with covers */
export async function getAnimeFull(id) {
  const res = await fetch(`${base}/api/jikan/anime/${id}`, { next: { revalidate } });
  if (!res.ok) throw new Error("Anime fetch failed");
  return res.json(); // { anime, recommendations }
}
