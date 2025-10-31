import NumberedPagination from "@/components/NumberedPagination";
import AnimeGrid from "@/components/AnimeGrid";
import Header from "@/components/Header"

async function fetchByGenre(slug, page = 1, limit = 24) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(
    `${base}/api/jikan/genre?slug=${encodeURIComponent(slug)}&page=${page}&limit=${limit}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Genre fetch failed");
  return res.json();
}

function prettyLabel(slug) {
  try {
    return decodeURIComponent(slug)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());
  } catch {
    return slug;
  }
}

export default async function GenrePage({ params, searchParams }) {
  const slug = params?.slug || "aksiyon";
  const page = Number(searchParams?.page || 1);

  const data = await fetchByGenre(slug, page, 24);
  const items = data.items || data.data || [];
  const pagination = data.pagination || {};
  const totalPages = pagination?.last_visible_page || 1;

  const title = prettyLabel(slug);

  return (
    <main className="py-8 pb-20 space-y-10">
        <Header />
      {/* Header */}
      <section className="mx-auto mt-10 max-w-6xl text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold">
          <span className="text-white/90">{title}</span>{" "}
          <span className="text-orange-500">Animeleri</span>
        </h1>
        <p className="mt-3 text-white/60">Bu türdeki animeleri keşfet!</p>
      </section>

      {/* Glassy anime container */}
      <section className="mx-auto mt-10 max-w-6xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-8
                shadow-[0_0_25px_rgba(255,255,255,0.1)]
                hover:shadow-[0_0_35px_rgba(59,130,246,0.5)]
                hover:border-blue-400/50
                transition-all duration-500 ease-out transform hover:-translate-y-1"
        >
        {items.length > 0 ? (
          <AnimeGrid animeList={items} />
        ) : (
          <div className="text-center text-white/60 text-lg py-20">
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
