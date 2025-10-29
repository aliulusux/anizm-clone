import AnimeCard from "@/components/AnimeCard";

async function fetchAnime(id: string) {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
  if (!res.ok) throw new Error("Anime not found");
  const data = await res.json();
  return data.data;
}

async function fetchEpisodes(id: string) {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/episodes`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export default async function AnimePage({
  params,
}: {
  params: { aid: string };
}) {
  try {
    const [anime, episodes] = await Promise.all([
      fetchAnime(params.aid),
      fetchEpisodes(params.aid),
    ]);

    return (
      <div style={{ padding: 20 }}>
        <h1 style={{ fontSize: 28, marginBottom: 10 }}>{anime.title}</h1>
        <p style={{ opacity: 0.8, marginBottom: 20 }}>{anime.synopsis}</p>

        {episodes.length > 0 && (
          <section
            className="glass"
            style={{
              padding: 20,
              borderRadius: 16,
              marginBottom: 40,
            }}
          >
            <h2 style={{ fontSize: 20, marginBottom: 14 }}>Bölümler</h2>

            <div
              className="episodes-slider"
              style={{
                display: "flex",
                overflowX: "auto",
                scrollBehavior: "smooth",
                gap: 12,
                paddingBottom: 10,
              }}
            >
              {episodes.map((ep: any) => (
                <div
                  key={ep.mal_id || ep.episode_id}
                  className="glass"
                  style={{
                    flex: "0 0 auto",
                    width: 160,
                    minHeight: 90,
                    borderRadius: 10,
                    padding: 10,
                    background: "rgba(255,255,255,0.05)",
                    boxShadow: "0 0 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <strong style={{ display: "block", marginBottom: 4 }}>
                    Bölüm {ep.mal_id || ep.mal || ep.number}: {ep.title}
                  </strong>
                  <p style={{ fontSize: 13, opacity: 0.7 }}>
                    {ep.aired
                      ? new Date(ep.aired).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  } catch (err) {
    console.error("Anime page error:", err);
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "20vh",
          opacity: 0.7,
          fontSize: 18,
        }}
      >
        <p>Bu anime bulunamadı veya sunucu hatası oluştu 😢</p>
      </div>
    );
  }
}
