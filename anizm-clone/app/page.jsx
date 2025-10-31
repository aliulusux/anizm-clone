"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import AnimeGrid from "@/components/AnimeGrid";
import GenreTabs from "@/components/GenreTabs";
import LoaderLayout from "@/components/LoaderLayout";
import SkeletonGrid from "@/components/SkeletonGrid";

export default function HomePage() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTop() {
      try {
        setLoading(true);
        const res = await fetch("/api/jikan/top?limit=24");
        const data = await res.json();
        setAnimeList(data.items || []);
      } catch {
        setAnimeList([]);
      } finally {
        setLoading(false);
      }
    }
    loadTop();
  }, []);

  return (
    <main className="container py-8 space-y-10">
      <Header />

      {/* 🔍 Search */}
      <section className="glass p-6 space-y-4">
        <h2 className="text-xl font-semibold">Anime Ara</h2>
        <SearchBar />
      </section>

      {/* 🔥 Top Anime */}
      <section className="space-y-4">
        <h2 className="grid-title">En Popüler Animeler</h2>
        {loading ? (
          <SkeletonGrid count={16} />
        ) : (
          <LoaderLayout count={16}>
            <AnimeGrid animeList={animeList} />
          </LoaderLayout>
        )}
      </section>

      {/* 🎨 Genres */}
      <section className="space-y-4">
        <h2 className="grid-title">Türlere Göre Keşfet</h2>
        <GenreTabs />
      </section>
    </main>
  );
}
