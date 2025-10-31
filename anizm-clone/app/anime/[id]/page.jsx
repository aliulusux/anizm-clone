"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import AnimeGrid from "@/components/AnimeGrid";
import EpisodeList from "@/components/EpisodeList";
import LoaderLayout from "@/components/LoaderLayout";
import SkeletonGrid from "@/components/SkeletonGrid";
import { motion } from "framer-motion";

export default function AnimeDetailPage({ params }) {
  const { id } = params;
  const [anime, setAnime] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/jikan/anime/${id}`);
        const data = await res.json();
        setAnime(data.anime);
        setRecommendations(data.recommendations || []);
      } catch {
        setAnime(null);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <SkeletonGrid count={12} />;
  if (!anime)
    return (
      <div className="container py-10 text-center opacity-70">
        <h2>Anime bulunamadı.</h2>
      </div>
    );

  return (
    <main className="container py-8 space-y-10">
      <Header />

      {/* 🎬 Anime Details */}
      <motion.section
        className="glass p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={anime.images?.jpg?.image_url}
            alt={anime.title}
            className="w-56 md:w-64 rounded-xl shadow-md object-cover"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-3">{anime.title}</h1>
            {anime.title_english && (
              <div className="text-sm opacity-70 mb-1">
                {anime.title_english}
              </div>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genres?.map((g) => (
                <span key={g.mal_id} className="badge">
                  {g.name}
                </span>
              ))}
            </div>
            <p className="opacity-80 leading-relaxed">
              {anime.synopsis || "Açıklama bulunamadı."}
            </p>
            <div className="mt-4 text-sm opacity-70">
              Yayın: {anime.aired?.string ?? "—"} • Bölüm:{" "}
              {anime.episodes ?? "?"} • Puan: {anime.score ?? "—"}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 📺 Episode list */}
      <section className="space-y-4">
        <h2 className="grid-title">Bölüm Listesi</h2>
        <LoaderLayout count={12}>
          <EpisodeList animeId={id} />
        </LoaderLayout>
      </section>

      {/* 🎞 Recommendations */}
      {recommendations.length > 0 && (
        <section className="space-y-4">
          <h2 className="grid-title">Benzer / Önerilenler</h2>
          <LoaderLayout count={12}>
            <AnimeGrid animeList={recommendations} />
          </LoaderLayout>
        </section>
      )}
    </main>
  );
}
