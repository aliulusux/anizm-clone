export const revalidate = 300;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || 24);

  const res = await fetch(`https://api.jikan.moe/v4/top/anime?limit=${limit}`, {
    next: { revalidate }
  });

  if (!res.ok) {
    return Response.json({ items: [] }, { status: 200 });
  }

  const data = await res.json();
  const items = (data?.data ?? []).map((x) => ({
    mal_id: x.mal_id,
    title: x.title,
    score: x.score,
    images: x.images
  }));

  return Response.json({ items }, { status: 200 });
}
