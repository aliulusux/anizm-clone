// src/lib/jikan.ts

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

type Img = { jpg?: { image_url?: string; large_image_url?: string } };

function pickImage(images?: Img) {
  return (
    images?.jpg?.large_image_url ||
    images?.jpg?.image_url ||
    null
  );
}

export function coverFallbackUrl(title: string, seed?: string) {
  const p = new URLSearchParams({ title, seed: seed || String(title.length) });
  return `${BASE}/api/cover?${p.toString()}`;
}

// ----------------------- MAIN FETCHERS -----------------------

export async function getAnime(aid: string | number) {
  const r = await fetch(`https://api.jikan.moe/v4/anime/${aid}/full`, {
    next: { revalidate: 300 },
  } as any);
  if (!r.ok) throw new Error("anime fetch failed");
  const { data } = await r.json();
  return data;
}

export async function getEpisodes(aid: string | number, page = 1) {
  const r = await fetch(
    `https://api.jikan.moe/v4/anime/${aid}/episodes?page=${page}`,
    { next: { revalidate: 300 } } as any
  );
  if (!r.ok) throw new Error("episodes fetch failed");
  const j = await r.json();
  return j.data ?? [];
}

// ----------------------- RELATIONS -----------------------

export async function getRelatedWithCovers(aid: string | number) {
  const r = await fetch(`https://api.jikan.moe/v4/anime/${aid}/relations`, {
    next: { revalidate: 600 },
  } as any);
  if (!r.ok) return [];
  const j = await r.json();

  const items: any[] = [];
  (j.data || []).forEach((rel: any) => {
    (rel.entry || []).forEach((e: any) => {
      items.push({
        mal_id: e.mal_id,
        title: e.name,
        images: e.images,
      });
    });
  });

  return items.map((it) => {
    const img = pickImage(it.images);
    return {
      mal_id: it.mal_id,
      title: it.title,
      cover: img || coverFallbackUrl(it.title, String(it.mal_id)),
    };
  });
}

// ----------------------- RECOMMENDATIONS -----------------------

export async function getRecommendations(aid: string | number) {
  const r = await fetch(
    `https://api.jikan.moe/v4/anime/${aid}/recommendations`,
    { next: { revalidate: 600 } } as any
  );
  if (!r.ok) return [];
  const j = await r.json();
  return (j.data || []).map((x: any) => {
    const a = x.entry;
    const img = pickImage(a?.images);
    return {
      mal_id: a?.mal_id,
      title: a?.title,
      cover: img || coverFallbackUrl(a?.title || "Unknown", String(a?.mal_id)),
    };
  });
}

// ----------------------- TRAILER -----------------------

export async function getTrailer(aid: string | number) {
  const r = await fetch(`https://api.jikan.moe/v4/anime/${aid}/videos`, {
    next: { revalidate: 600 },
  } as any);
  if (!r.ok) return null;
  const j = await r.json();
  const yt =
    j?.data?.promo?.[0]?.trailer?.youtube_id ||
    j?.data?.music_videos?.[0]?.video?.youtube_id;
  return yt ? `https://www.youtube.com/embed/${yt}` : null;
}
