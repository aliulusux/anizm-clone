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
  const [fallbackMode, setFallbackMode] = useState(false);

  const genre = decodeURIComponent(params.slug)
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  useEffect(() => {
    async function fetchGenre() {
      try {
        setLoading(true);
        setFallbackMode(false);

        // 🎯 Fetch anime by genre
        const res = await fetch(`/api/jikan/genre?genre=${genre}`);
        const data = await res.json();

        if (data.items && data.items.length > 0) {
          setAnimeList(data.items);
        } else {
          console.warn(`No anime found for "${genre}", loading top anime fallback...`);

          // 🪄 Fallback: fetch top anime
          const resTop = await fetch(`/api/jikan/top?limit=24`);
          const dataTop = await resTop.json();

          if (dataTop.items && dataTop.items.length > 0) {
            setAnimeList(dataTop.items);
            setFallbackMode(true);
          }
        }
      } catch (err) {
        console.error("Genre fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGenre();
  }, [genre]);

  return (
    <main className="container py-10 space-y-8 fade-in">
      {/* ⬅️ Back Button */}
      <button
        onClick={() => router.back()}
        className="glass px-4 py-2 rounded-full hover:bg-white/10 transition text-sm font-medium"
      >
        ← Geri Dön
      </button>

      {/* 🏷️ Title */}
      <div className="glass mx-auto max-w-3xl p-8 rounded-3xl text-center backdrop-blur-md shadow-xl border border-white/10 fade-up">
        <h1 className="text-3xl font-bold">
          <span className="capitalize">{genre}</span>{" "}
          <span className="text-orange-400">Animeleri</span>
        </h1>

        {fallbackMode ? (
          <p className="text-sm mt-2 text-gray-400">
            Bu türde anime bulunamadı. <br />
            En popüler animeler gösteriliyor 👇
          </p>
        ) : (
          <p className="text-sm mt-2 text-gray-400">
            {loading ? "Yükleniyor..." : "Bu türdeki animeleri keşfet!"}
          </p>
        )}
      </div>

      {/* 🎬 Anime List */}
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
