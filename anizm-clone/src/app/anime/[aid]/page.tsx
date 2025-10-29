import Image from "next/image";

async function fetchAnime(id: string) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
    if (!res.ok) throw new Error("Anime not found");
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

async function fetchEpisodes(id: string) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/episodes`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function fetchRelated(id: string) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/relations`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.data) return [];
    return (
      data.data
        ?.flatMap((r: any) => r.entry)
        ?.filter((a: any) => a.type === "anime") || []
    );
  } catch {
    return [];
  }
}

export default async function AnimePage({
  params,
}: {
  params: { aid: string };
}) {
  try {
    const [anime, episodes, related] = await Promise.all([
      fetchAnime(params.aid),
      fetchEpisodes(params.aid),
      fetchRelated(params.aid),
    ]);

    return (
      <div style={{ padding: "30px 20px", color: "white" }}>
        {/* --- Anime Header --- */}
        <section
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 24,
            marginBottom: 40,
            flexWrap: "wrap",
          }}
        >
          {/* Cover Image */}
          {anime.images?.jpg?.large_image_url && (
            <div
              style={{
                flex: "0 0 auto",
                width: 260,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              }}
            >
              <Image
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                width={260}
                height={360}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          )}

          {/* Anime Info */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <h1 style={{ fontSize: 26, marginBottom: 10 }}>{anime.title}</h1>
            <p style={{ opacity: 0.8, fontSize: 15, lineHeight: 1.6 }}>
              {anime.synopsis}
            </p>
          </div>
        </section>

        {/* --- Episodes --- */}
        {episodes.length > 0 && (
          <section
            className="glass"
            style={{
              padding: 20,
              borderRadius: 16,
              marginBottom: 40,
              background: "rgba(255,255,255,0.04)",
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
                    transition: "transform 0.2s ease",
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

        {/* --- Related Anime --- */}
        {related.length > 0 && (
          <section
            className="glass"
            style={{
              padding: 20,
              borderRadius: 16,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <h2 style={{ fontSize: 20, marginBottom: 14 }}>Benzer Animeler</h2>
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                gap: 12,
                scrollBehavior: "smooth",
                paddingBottom: 10,
              }}
            >
              {related.map((rel: any) => (
                <a
                  key={rel.mal_id}
                  href={`/anime/${rel.mal_id}`}
                  className="glass"
                  style={{
                    flex: "0 0 auto",
                    width: 160,
                    textDecoration: "none",
                    color: "white",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 10,
                    overflow: "hidden",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget.style.transform = "scale(1.05)"))
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget.style.transform = "scale(1)"))
                  }
                >
                  {rel.images?.jpg?.image_url && (
                    <Image
                      src={rel.images.jpg.image_url}
                      alt={rel.title}
                      width={160}
                      height={220}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "220px",
                      }}
                    />
                  )}
                  <p
                    style={{
                      fontSize: 13,
                      padding: 8,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {rel.title}
                  </p>
                </a>
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
