"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AnimeGrid from "@/components/AnimeGrid";
import LoaderLayout from "@/components/LoaderLayout";
import SkeletonGrid from "@/components/SkeletonGrid";

export default function GenrePage({ params }) {
  const router = useRouter();
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const genre = decodeURIComponent(params.slug)
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  useEffect(() => {
    async function fetchGenre() {
      try {
        setLoading(true);
        setNotFound(false);

        // 🎯 Fetch anime for selected genre
        const res = await fetch(`/api/jikan/genre?genre=${genre}`);
        const data = await res.json();

        if (data.items && data.items.length > 0) {
          setAnimeList(data.items);
        } else {
          console.warn(`No anime found for genre "${genre}". Loading fallback...`);

          // 🪄 Fallback: fetch top anime
          const resTop = await fetch(`/api/jikan/top?limit=12`);
          const dataTop = await resTop.json();

          if (dataTop.items && dataTop.items.length > 0) {
            setAnimeList(dataTop.items);
          } else {
            setNotFound(true);
          }
        }
      } catch (err) {
        console.error("Genre fetch error:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchGenre();
  }, [genre]);

  return (
    <main className="container py-10 space-y-8 fade-in">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="glass px-4 py-2 rounded-full hover:bg-white/10 transition text-sm font-medium"
      >
        ← Geri Dön
      </button>

      {/* Genre Title */}
      <div className="glass mx-auto max-w-3xl p-8 rounded-3xl text-center backdrop-blur-md shadow-xl border border-white/10 fade-up">
        <h1 className="text-3xl font-bold">
          <span className="capitalize">{genre}</span>{" "}
          <span className="text-orange-400">Animeleri</span>
        </h1>
        {notFound && (
          <p className="text-sm mt-2 text-gray-400">
            Bu türde anime bulunamadı 😔
          </p>
        )}
      </div>

      {/* Anime Grid */}
      {loading ? (
        <SkeletonGrid count={16} />
      ) : animeList.length > 0 ? (
        <LoaderLayout count={16}>
          <AnimeGrid animeList={animeList} />
        </LoaderLayout>
      ) : (
        <p className="text-center text-gray-400 mt-10">
          Hiçbir sonuç bulunamadı 😢
        </p>
      )}
    </main>
  );
}
