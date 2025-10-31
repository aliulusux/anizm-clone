// app/genre/[slug]/page.jsx
import Header from "@/components/Header";
import AnimeGrid from "@/components/AnimeGrid";
import NumberedPagination from "@/components/NumberedPagination";

const GENRE_MAP = {
  aksiyon: 1, askeri: 38, "bilim kurgu": 24, büyü: 16, "doğaüstü güçler": 37,
  dram: 8, dövüş: 17, ecchi: 9, fantastik: 10, gerilim: 41, gizem: 7,
  harem: 35, josei: 43, komedi: 4, korku: 14, macera: 2, mecha: 18, film: 80,
  müzik: 19, ova: 12, okul: 23, oyun: 11, psikolojik: 40, romantizm: 22,
  seinen: 42, shoujo: 25, "shoujo ai": 26, shounen: 27, "shounen ai": 28,
  "yaşamdan kesitler": 36, spor: 30, "süper güç": 31, tarihi: 20, uzay: 29,
  vampir: 32, yaoi: 33, yuri: 34, polisiye: 39, samuray: 21, parodi: 3,
  şeytanlar: 15, "savaş sanatları": 17, çocuk: 5, ona: 13, arabalar: 3,
  "kişilik bölünmesi": 40, // keep extras mapped if you use them in footer
};

function toTitle(str = "") {
  return str
    .replace(/%20/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\w\S*/g, s => s[0].toUpperCase() + s.slice(1));
}

export default async function GenrePage({ params, searchParams }) {
  const slug = decodeURIComponent(params.slug || "");
  const genreId = GENRE_MAP[slug.toLowerCase()] ?? null;

  const page = Number(searchParams?.page || 1);
  const limit = 24;

  let items = [];
  let lastPage = 1;

  if (genreId) {
    // Use Jikan directly on the server (no CORS issues on server)
    const url =
      `https://api.jikan.moe/v4/anime?genres=${genreId}&page=${page}&limit=${limit}&order_by=score&sort=desc`;

    const res = await fetch(url, { next: { revalidate: 300 } });
    if (res.ok) {
      const json = await res.json();
      items = json?.data ?? [];
      lastPage = json?.pagination?.last_visible_page ?? 1;
    }
  }

  // Fallback if this genre is empty: show top anime page 1 and lastPage=1
  if (!items?.length) {
    const topRes = await fetch(
      `https://api.jikan.moe/v4/top/anime?limit=${limit}`,
      { next: { revalidate: 300 } }
    );
    if (topRes.ok) {
      const json = await topRes.json();
      items = json?.data ?? [];
      lastPage = 1;
    }
  }

  const displayTitle = toTitle(slug);

  return (
    <>
      {/* same header as homepage */}
      <Header />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title block */}
        <div className="mt-10 mb-8 rounded-3xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl">
          <div className="px-6 py-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="text-primary-500 dark:text-orange-400">{displayTitle}</span>{" "}
              <span className="text-gray-800 dark:text-gray-100">Animeleri</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Bu türdeki animeleri keşfet!
            </p>
          </div>
        </div>

        {/* Grid */}
        <AnimeGrid animeList={items} dense />

        {/* Numbered pagination */}
        <div className="my-10">
          <NumberedPagination
            basePath={`/genre/${encodeURIComponent(slug)}`}
            currentPage={page}
            totalPages={lastPage}
          />
        </div>
      </section>
    </>
  );
}
