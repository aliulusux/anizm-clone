import Image from "next/image";
import Link from "next/link";

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Fetch genre data with pagination
async function fetchGenre(slug, page = 1) {
  try {
    const res = await fetch(
      `${BASE}/api/jikan/genre/${encodeURIComponent(slug)}?page=${page}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error("Failed to fetch genre anime");
    return res.json();
  } catch (err) {
    console.error("fetchGenre error:", err);
    return { data: [], pagination: { last_visible_page: 1 } };
  }
}

export default async function GenrePage({ params, searchParams }) {
  const slug = params.slug;
  const page = parseInt(searchParams.page || "1", 10);
  const data = await fetchGenre(slug, page);
  const animeList = data.data || [];
  const totalPages = data.pagination?.last_visible_page || 1;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 text-gray-200">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">
          <span className="text-orange-400 capitalize">{slug}</span> Animeleri
        </h1>
        <p className="text-gray-400 mt-2">Bu türdeki animeleri keşfet!</p>
      </div>

      {/* Anime Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {animeList.map((anime) => (
          <Link
            href={`/anime/${anime.mal_id}`}
            key={anime.mal_id}
            className="group glass rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_25px_rgba(0,200,255,0.35)]"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || ""}
                alt={anime.title}
                width={300}
                height={420}
                unoptimized
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col justify-between flex-grow bg-black/40 text-white p-2">
              <p className="text-sm font-medium truncate text-center">{anime.title}</p>
              <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs mt-1">
                <span>⭐</span>
                <span>{anime.score || "N/A"}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-10">
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((num) => (
          <Link
            key={num}
            href={`/genre/${slug}?page=${num}`}
            className={`px-3 py-1.5 rounded-md border transition-all duration-300 ${
              num === page
                ? "bg-orange-500 border-orange-400 text-white"
                : "bg-transparent border-gray-600 hover:bg-gray-700"
            }`}
          >
            {num}
          </Link>
        ))}
      </div>
    </main>
  );
}
