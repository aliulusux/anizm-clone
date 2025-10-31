"use client";
export const dynamic = "force-dynamic";

import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import AnimeGrid from "@/components/AnimeGrid";
import LoaderLayout from "@/components/LoaderLayout";
import { searchAnime } from "@/lib/jikan";

export default async function SearchPage({ searchParams }) {
  const q = (searchParams?.q ?? "").toString();
  const page = Number(searchParams?.page ?? 1);
  const { items, pagination } = q
    ? await searchAnime(q, page)
    : { items: [], pagination: null };

  return (
    <main className="container py-8 space-y-10">
      <Header />

      {/* 🔍 Search input */}
      <section className="glass p-6 space-y-4">
        <h2 className="text-xl font-semibold">Anime Ara</h2>
        <SearchBar defaultValue={q} />
      </section>

      {/* 🧠 Results */}
      <section className="space-y-6">
        {q ? (
          <>
            <h2 className="grid-title">“{q}” için sonuçlar</h2>
            <LoaderLayout count={16}>
              <AnimeGrid animeList={items} />
            </LoaderLayout>

            {pagination && (
              <div className="flex items-center justify-between mt-6">
                <a
                  href={`/search?q=${encodeURIComponent(q)}&page=${page - 1}`}
                  className={`px-4 py-2 rounded-xl glass ${
                    page <= 1 ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  ← Önceki
                </a>

                <span className="text-sm opacity-70">
                  Sayfa {pagination.current_page} /{" "}
                  {pagination.last_visible_page}
                </span>

                <a
                  href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}
                  className={`px-4 py-2 rounded-xl glass ${
                    pagination.has_next_page ? "" : "opacity-50 pointer-events-none"
                  }`}
                >
                  Sonraki →
                </a>
              </div>
            )}
          </>
        ) : (
          <p className="opacity-70">Aramak için yukarıdaki kutuyu kullan.</p>
        )}
      </section>
    </main>
  );
}
