export const revalidate = 300;

async function fetchJson(url) {
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) return null;
  return res.json();
}

export async function GET(_req, { params }) {
  const { id } = params;

  // Full details
  const full = await fetchJson(`https://api.jikan.moe/v4/anime/${id}/full`);

  // Recommendations (these have proper cover images)
  const rec = await fetchJson(`https://api.jikan.moe/v4/anime/${id}/recommendations`);

  const anime = full?.data
    ? {
        mal_id: full.data.mal_id,
        title: full.data.title,
        title_english: full.data.title_english,
        synopsis: full.data.synopsis,
        genres: full.data.genres,
        images: full.data.images,
        score: full.data.score,
        episodes: full.data.episodes,
        aired: full.data.aired
      }
    : null;

  const recommendations = (rec?.data ?? [])
    .slice(0, 20)
    .map((r) => ({
      mal_id: r.entry?.mal_id,
      title: r.entry?.title,
      images: r.entry?.images,
      score: r.votes // not a real score, but a popularity vote count
    }))
    .filter((x) => x.mal_id && x.images?.jpg?.image_url);

  return Response.json({ anime, recommendations }, { status: 200 });
}
