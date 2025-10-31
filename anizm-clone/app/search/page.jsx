import AnimeGrid from "@/components/AnimeGrid";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import { searchAnime } from "@/lib/jikan";

export const dynamic = "force-dynamic"; // allow fresh search

export default async function SearchPage({ searchParams }) {
  const q = (searchParams?.q ?? "").toString();
  const page = Number(searchParams?.page ?? 1);
  const { items, pagination } = q ? await searchAnime(q, page) : { items: [], pagination: null };

  return (
    <main className="container py-8 space-y-6">
      <Header />
      <div className="glass p-4">
        <SearchBar defaultValue={q} />
      </div>

      {q ? (
        <>
          <h2 className="grid-title">“{q}” için sonuçlar</h2>
          <AnimeGrid animeList={items} />
          {pagination && (
            <div className="flex items-center justify-between mt-6">
              <a
                className={`px-4 py-2 rounded-lg glass ${page <= 1 ? "pointer-events-none opacity-50" : ""}`}
                href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}
              >
                ← Önceki
              </a>
              <span className="text-sm opacity-70">
                Sayfa {pagination.current_page} / {pagination.last_visible_page}
              </span>
              <a
                className={`px-4 py-2 rounded-lg glass ${pagination.has_next_page ? "" : "pointer-events-none opacity-50"}`}
                href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}
              >
                Sonraki →
              </a>
            </div>
          )}
        </>
      ) : (
        <p className="opacity-70">Aramak için yukarıdaki kutuyu kullan.</p>
      )}
    </main>
  );
}
