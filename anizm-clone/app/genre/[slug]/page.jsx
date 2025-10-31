"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AnimeGrid from "@/components/AnimeGrid";
import SkeletonGrid from "@/components/SkeletonGrid";

export default function GenrePage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);

  const genre = decodeURIComponent(params.slug)
    .replace(/-/g, " ")
    .trim();
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    async function loadGenre() {
      setLoading(true);
      try {
        const res = await fetch(`/api/jikan/genre?genre=${genre}&page=${page}`);
        const data = await res.json();
        setAnimeList(data.data || []);
        setPageCount(data.pagination?.last_visible_page || 1);
      } catch (e) {
        console.error("Genre load error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadGenre();
  }, [genre, page]);

  const goToPage = (num) => {
    router.push(`/genre/${params.slug}?page=${num}`);
  };

  return (
    <main className="container py-10 space-y-8 fade-in">
      <h1 className="text-center text-3xl font-bold">
        <span className="text-orange-400 capitalize">{genre}</span> Animeleri
      </h1>
      <p className="text-center text-gray-400 mb-4">
        Bu türdeki animeleri keşfet!
      </p>

      {loading ? (
        <SkeletonGrid count={24} />
      ) : (
        <AnimeGrid animeList={animeList} />
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-10">
        {[...Array(pageCount > 5 ? 5 : pageCount)].map((_, i) => {
          const num = i + 1;
          return (
            <button
              key={num}
              onClick={() => goToPage(num)}
              className={`px-3 py-1.5 rounded-md border transition-all ${
                num === page
                  ? "bg-orange-500 border-orange-400 text-white"
                  : "bg-transparent border-gray-600 hover:bg-gray-700"
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>
    </main>
  );
}
