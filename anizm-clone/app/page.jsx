"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import AnimeGrid from "@/components/AnimeGrid";
import LoaderLayout from "@/components/LoaderLayout";
import SkeletonGrid from "@/components/SkeletonGrid";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [animeList, setAnimeList] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  // Run search when query changes (initial load or new search)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const page = params.get("page") || 1;
    if (!q) return;
    setQuery(q);
    setLoading(true);

    fetch(`/api/jikan/search?q=${encodeURIComponent(q)}&page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setAnimeList(data.items || []);
        setPagination(data.pagination || null);
      })
      .catch(() => {
        setAnimeList([]);
        setPagination(null);
      })
      .finally(() => setLoading(false));
  }, [typeof window !== "undefined" && window.location.search]);

  return (
    <main className="container py-8 space-y-10">
      <Header />

      {/* 🔍 Search Input */}
      <section className="glass p-6 space-y-4">
        <h2 className="text-xl font-semibold">Anime Ara</h2>
        <SearchBar defaultValue={query} />
      </section>

      {/* 🧠 Results Section */}
      <section className="space-y-6">
        {loading ? (
          <SkeletonGrid count={16} />
        ) : query ? (
          <>
            <h2 className="grid-title">“{query}” için sonuçlar</h2>

            <LoaderLayout count={16}>
              <AnimeGrid animeList={animeList} />
            </LoaderLayout>

            {/* Pagination */}
            {pagination && (
              <div className="flex items-center justify-between mt-6">
                <a
                  href={`/search?q=${encodeURIComponent(query)}&page=${Number(pagination.current_page) - 1}`}
                  className={`px-4 py-2 rounded-xl glass ${
                    pagination.current_page <= 1
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                >
                  ← Önceki
                </a>

                <span className="text-sm opacity-70">
                  Sayfa {pagination.current_page} / {pagination.last_visible_page}
                </span>

                <a
                  href={`/search?q=${encodeURIComponent(query)}&page=${Number(pagination.current_page) + 1}`}
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
