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

  const genreSlug = decodeURIComponent(params.slug);

  useEffect(() => {
    async function fetchGenre() {
      try {
        setLoading(true);
        const res = await fetch(`/api/jikan/genre?genre=${params.slug}`);
        const data = await res.json();
        setAnimeList(data.items || []);
      } catch (err) {
        console.error("Genre fetch error:", err);
        setAnimeList([]);
      } finally {
        setLoading(false);
      }
    }
    fetchGenre();
  }, [genreSlug]);

  return (
    <main className="relative min-h-screen py-10 px-4 sm:px-8 text-center">
      {/* 🔮 Background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#111827]" />

      {/* 🪄 Header card */}
      <div className="glass mx-auto max-w-4xl p-8 rounded-3xl text-center backdrop-blur-md shadow-xl border border-white/10 fade-up">
        <button
          onClick={() => router.back()}
          className="absolute left-6 top-6 text-sm text-white/70 hover:text-white bg-white/10 px-4 py-2 rounded-full backdrop-blur-md"
        >
          ← Geri Dön
        </button>

        <h1 className="text-3xl sm:text-4xl font-extrabold capitalize mb-2">
          <span className="text-white">{genreSlug}</span>{" "}
          <span className="text-orange-400">Animeleri</span>
        </h1>

        {animeList.length === 0 && !loading && (
          <p className="text-gray-300 mt-3 text-sm">
            Bu türde anime bulunamadı 😳
          </p>
        )}
      </div>

      {/* 🎬 Anime Grid */}
      <section className="mt-12">
        {loading ? (
          <SkeletonGrid count={16} />
        ) : (
          <LoaderLayout count={16}>
            <AnimeGrid animeList={animeList} />
          </LoaderLayout>
        )}
      </section>
    </main>
  );
}
