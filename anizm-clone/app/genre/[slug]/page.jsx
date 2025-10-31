import NumberedPagination from '@/components/NumberedPagination';
import AnimeGrid from '@/components/AnimeGrid';

async function fetchByGenre(slug, page = 1, limit = 24) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(
    `${base}/api/jikan/genre?slug=${encodeURIComponent(slug)}&page=${page}&limit=${limit}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error('Genre fetch failed');
  return res.json();
}

function prettyLabel(slug) {
  try {
    return decodeURIComponent(slug)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (m) => m.toUpperCase());
  } catch {
    return slug;
  }
}

export default async function GenrePage({ params, searchParams }) {
  const slug = params?.slug || 'aksiyon';
  const page = Number(searchParams?.page || 1);

  // Fetch & normalize response
  const data = await fetchByGenre(slug, page, 24);
  const items = data.items || data.data || data.results || [];
  const pagination = data.pagination || {};
  const totalPages = pagination?.last_visible_page || 1;

  const title = prettyLabel(slug);

  return (
    <main className="px-4 pb-20">
      {/* Top header */}
      <section className="mx-auto mt-10 max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">
        <h1 className="text-3xl sm:text-4xl font-extrabold">
          <span className="text-white/90">{title}</span>{' '}
          <span className="text-orange-500">Animeleri</span>
        </h1>
        <p className="mt-3 text-white/60">Bu türdeki animeleri keşfet!</p>
      </section>

      {/* Anime grid */}
      <section className="mx-auto mt-10 max-w-6xl">
        {items.length > 0 ? (
          <AnimeGrid animeList={items} />
        ) : (
          <div className="text-center text-white/50 text-lg py-20 backdrop-blur-sm rounded-2xl bg-white/5 border border-white/10">
            Bu türde henüz anime bulunamadı 😢
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <NumberedPagination
          current={page}
          totalPages={totalPages}
          basePath={`/genre/${encodeURIComponent(slug)}`}
          window={1}
        />
      )}
    </main>
  );
}
