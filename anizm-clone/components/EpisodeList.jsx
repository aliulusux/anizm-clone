"use client";
import { useEffect, useState } from "react";

export default function EpisodeList({ animeId }) {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/episodes`);
        const data = await res.json();
        setEpisodes(data.data || []);
      } catch {
        setEpisodes([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [animeId]);

  if (loading) return <p className="opacity-60">Bölümler yükleniyor...</p>;
  if (!episodes.length) return <p className="opacity-60">Bölüm listesi bulunamadı.</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {episodes.slice(0, 24).map((ep) => (
        <div
          key={ep.mal_id}
          className="glass p-3 text-sm hover:scale-105 transition cursor-pointer"
        >
          <div className="font-medium">Bölüm {ep.mal_id}</div>
          <div className="opacity-70 line-clamp-2">{ep.title}</div>
        </div>
      ))}
    </div>
  );
}
