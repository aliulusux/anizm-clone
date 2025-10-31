import NumberedPagination from "@/components/NumberedPagination";
import AnimeGrid from "@/components/AnimeGrid";
import Header from "@/components/Header";

// ✅ Fetch genre data safely
async function fetchByGenre(slug, page = 1, limit = 24) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(
      `${base}/api/jikan/genre?genre=${encodeURIComponent(slug)}&page=${page}&limit=${limit}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) throw new Error(`Genre fetch failed: ${res.status}`);

    const data = await res.json();
    return data || {};
  } catch (err) {
    console.error("❌ fetchByGenre error:", err);
    return { data: [], pagination: {} };
  }
}

// ✅ Nicely formatted genre title
function prettyLabel(slug) {
  try {
    return decodeURIComponent(slug)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());
  } catch {
    return slug;
  }
}

// ✅ Main genre page component
export default async function GenrePage({ params, searchParams }) {
  const slug = params?.slug || "aksiyon";
  const page = Number(searchParams?.page || 1);

  // Fetch the genre data
  let data = {};
  try {
    data = await fetchByGenre(slug, page, 24);
  } catch (err) {
    console.error("❌ GenrePage fetch error:", err);
    data = {};
  }

  // ✅ Corrected data extraction
  const items =
    Array.isArray(data?.data) ? data.data :
    Array.isArray(data?.items) ? data.items :
    Array.isArray(data) ? data :
    [];

  const pagination = data.pagination || {};
  const totalPages = pagination?.last_visible_page || 1;
  const title = prettyLabel(slug);

  // ✅ UI stays exactly the same
  return (
    <main className="container py-4 space-y-8">
      <Header />

      {/* Header section */}
      <section className="mx-auto mt-10 max-w-6xl text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold">
          <span className="text-white/90">{title}</span>{" "}
          <span className="text-orange-500">Animeleri</span>
        </h1>
        <p className="mt-3 text-white/60">Bu türdeki animeleri keşfet!</p>
      </section>

      {/* Glassy anime container */}
      <section
        className="mx-auto mt-10 max-w-6xl rounded-3xl border border-white/10 
        bg-white/5 backdrop-blur-lg p-8 shadow-[0_0_25px_rgba(255,255,255,0.1)]"
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
