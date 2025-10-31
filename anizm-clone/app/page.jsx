"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import GenreTabs from "@/components/GenreTabs";
import LoaderLayout from "@/components/LoaderLayout";
import SkeletonGrid from "@/components/SkeletonGrid";
import AnimeCarousel from "@/components/AnimeCarousel"; // 👈 new import
import GenreFooter from "@/components/GenreFooter";

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
      {/* 🌐 Header */}
      <Header />

      {/* 🔍 Search */}
      <section className="glass p-6 space-y-4">
        <h2 className="text-xl font-semibold">Anime Ara</h2>
        <SearchBar />
      </section>

      {/* 🔥 Top Anime (Now Carousel) */}
      <section className="space-y-4">
        <h2 className="grid-title">En Popüler Animeler</h2>
        {loading ? (
          <SkeletonGrid count={16} />
        ) : (
          <LoaderLayout count={16}>
            <AnimeCarousel animeList={animeList} />
          </LoaderLayout>
        )}
      </section>

      {/* 🎨 Genres */}
      <section className="space-y-4">
        <h2 className="grid-title">Yeni Çıkan Bölümler</h2>
      </section>
      <GenreFooter />   {/* ← Add this here */}
    </main>
  );
}
