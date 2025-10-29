// Replaced with Jikan API (MyAnimeList)
const BASE = "https://api.jikan.moe/v4";

export async function getSeasonalAnime() {
  try {
    const res = await fetch("https://api.jikan.moe/v4/seasons/now");
    if (!res.ok) throw new Error(`Jikan returned ${res.status}`);

    const data = await res.json();
    return data.data.map((a: any) => ({
      aid: a.mal_id,
      title: a.title,
      image: a.images?.jpg?.large_image_url || a.images?.jpg?.image_url,
      episodes: a.episodes,
      score: a.score,
      season: `${a.season || "Unknown"} ${a.year || ""}`,
    }));
  } catch (err) {
    console.error("Failed to fetch seasonal anime:", err);
    return [];
  }
}

export async function getHotAnime() {
  try {
    const res = await fetch(`${BASE}/top/anime?filter=bypopularity&limit=12`);
    if (!res.ok) throw new Error(`Jikan returned ${res.status}`);
    const data = await res.json();

    return data.data.map((a: any) => ({
      aid: a.mal_id,
      title: a.title,
      image: a.images?.jpg?.large_image_url || a.images?.jpg?.image_url,
      episodes: a.episodes,
      score: a.score,
    }));
  } catch (err) {
    console.error("Failed to fetch top anime from Jikan:", err);
    return [];
  }
}

export async function searchAnimeByTitle(query: string) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=20`);
    if (!res.ok) throw new Error(`Jikan returned ${res.status}`);
    const data = await res.json();

    return data.data.map((a: any) => ({
      aid: a.mal_id,
      title: a.title,
      image: a.images?.jpg?.image_url,
      episodes: a.episodes,
      score: a.score,
    }));
  } catch (err) {
    console.error("Failed to search anime:", err);
    return [];
  }
}

export async function getAnimeById(aid: string) {
  try {
    const res = await fetch(`${BASE}/anime/${aid}/full`);
    if (!res.ok) throw new Error(`Jikan returned ${res.status}`);
    const data = await res.json();
    const anime = data.data;

    return {
      aid: anime.mal_id,
      title: anime.title,
      synopsis: anime.synopsis,
      score: anime.score,
      episodes: anime.episodes,
      image: anime.images?.jpg?.large_image_url,
      genres: anime.genres?.map((g: any) => g.name) || [],
      type: anime.type,
      year: anime.year,
    };
  } catch (err) {
    console.error("Failed to fetch anime by ID:", err);
    return null;
  }
}
