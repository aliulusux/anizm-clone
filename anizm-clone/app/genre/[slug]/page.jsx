import NumberedPagination from "@/components/NumberedPagination";
import AnimeGrid from "@/components/AnimeGrid";
import Header from "@/components/Header";

async function fetchByGenre(slug, page = 1, limit = 24) {
  try {
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const res = await fetch(
      `${base}/api/jikan/genre?slug=${encodeURIComponent(slug)}&page=${page}&limit=${limit}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) throw new Error(`Genre fetch failed: ${res.status}`);

    const data = await res.json();

    // ✅ Normalize structure to always return items[]
    if (Array.isArray(data)) {
      return { items: data, pagination: {} };
    } else if (Array.isArray(data.data)) {
      return { items: data.data, pagination: data.pagination || {} };
    } else if (Array.isArray(data.items)) {
      return { items: data.items, pagination: data.pagination || {} };
    } else {
      console.warn("⚠️ Unexpected API format:", data);
      return { items: [], pagination: {} };
    }
  } catch (err) {
    console.error("❌ fetchByGenre error:", err);
    return { items: [], pagination: {} };
  }
}

// ✅ Keep pretty label safe
function prettyLabel(slug) {
  try {
    return decodeURIComponent(slug)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());
  } catch {
    return slug;
  }
}

// ✅ Main page
export default async function GenrePage({ params, searchParams }) {
  const slug = params?.slug || "aksiyon";
  const page = Number(searchParams?.page || 1);

  // Safe fetch
  let data = {};
  try {
    data = await fetchByGenre(slug, page, 24);
  } catch (err) {
    console.error("❌ GenrePage fetch error:", err);
    data = {};
    
  }
    console.log("🧩 GenrePage debug:", {
      slug,
      raw: data,
      itemsLength: Array.isArray(data?.items)
        ? data.items.length
        : Array.isArray(data?.data)
        ? data.data.length
        : 0,
      keys: Object.keys(data || {}),
    });



  // Defensive parsing
  const items = Array.isArray(data.items)
    ? data.items
    : Array.isArray(data.data)
    ? data.data
    : [];

  const pagination = data.pagination || {};
  const totalPages = pagination?.last_visible_page || 1;
  const title = prettyLabel(slug);

  // ✅ Render (UI unchanged)
  return (
    
    <main className="container py-4 space-y-8">
      {/* Temporary debug */}
      <section className="text-xs text-white bg-black/30 p-4 rounded-lg">
        <h2>🧩 Debug Data</h2>
        <pre>{JSON.stringify(data, null, 2).slice(0, 1000)}</pre>
      </section>
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
