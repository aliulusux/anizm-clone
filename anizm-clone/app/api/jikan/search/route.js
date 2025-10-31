export const revalidate = 120;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || 1);

  if (!q.trim()) return Response.json({ items: [], pagination: null });

  const res = await fetch(
    `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&page=${page}&sfw=true&limit=24`,
    { next: { revalidate } }
  );

  if (!res.ok) {
    return Response.json({ items: [], pagination: null }, { status: 200 });
  }

  const data = await res.json();

  return Response.json({
    items: (data?.data ?? []).map((x) => ({
      mal_id: x.mal_id,
      title: x.title,
      score: x.score,
      images: x.images
    })),
    pagination: data?.pagination ?? null
  });
}
