import Image from "next/image";

async function safeFetch(url: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

async function fetchAnime(id: string) {
  return await safeFetch(`https://api.jikan.moe/v4/anime/${id}/full`);
}

async function fetchEpisodes(id: string) {
  const data = await safeFetch(`https://api.jikan.moe/v4/anime/${id}/episodes`);
  return Array.isArray(data) ? data : [];
}

async function fetchRelated(id: string) {
  const relData = await safeFetch(`https://api.jikan.moe/v4/anime/${id}/relations`);
  if (!Array.isArray(relData)) return [];
  return relData
    .flatMap((r: any) => r.entry)
    .filter((a: any) => a?.type === "anime")
    .map((a: any) => ({
      mal_id: a.mal_id,
      title: a.name || a.title,
      images: a.images || {},
    }));
}

export default async function AnimePage({ params }: { params: { aid: string } }) {
  const [anime, episodes, related] = await Promise.all([
    fetchAnime(params.aid),
    fetchEpisodes(params.aid),
    fetchRelated(params.aid),
  ]);

  // 🔒 Defensive guard
  if (!anime) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "20vh",
          color: "white",
          opacity: 0.7,
          fontSize: 18,
        }}
      >
        <p>Bu anime bulunamadı veya yüklenemedi 😢</p>
      </div>
    );
  }

  const cover = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  return (
    <div style={{ padding: "30px 20px", color: "white" }}>
      {/* --- Anime Header --- */}
      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          alignItems: "flex-start",
          marginBottom: 40,
        }}
      >
        {cover && (
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
              src={cover}
              alt={anime.title || "Anime Cover"}
              width={260}
              height={360}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 style={{ fontSize: 26, marginBottom: 10 }}>{anime.title}</h1>
          <p style={{ opacity: 0.8, fontSize: 15, lineHeight: 1.6 }}>
            {anime.synopsis || "Açıklama bulunamadı."}
          </p>
        </div>
      </section>

      {/* --- Episodes --- */}
      {episodes.length > 0 && (
        <section
          style={{
            padding: 20,
            borderRadius: 16,
            background: "rgba(255,255,255,0.04)",
            marginBottom: 40,
          }}
        >
          <h2 style={{ fontSize: 20, marginBottom: 14 }}>Bölümler</h2>
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: 12,
              paddingBottom: 10,
              scrollBehavior: "smooth",
            }}
          >
            {episodes.map((ep: any) => (
              <div
                key={ep.mal_id || ep.episode_id}
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
                  {ep.aired ? new Date(ep.aired).toLocaleDateString() : "-"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- Related Anime --- */}
      <section
        style={{
          padding: 20,
          borderRadius: 16,
          background: "rgba(255,255,255,0.04)",
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 14 }}>Benzer Animeler</h2>
        {related.length > 0 ? (
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: 12,
              paddingBottom: 10,
              scrollBehavior: "smooth",
            }}
          >
            {related.map((rel: any) => (
              <a
                key={rel.mal_id}
                href={`/anime/${rel.mal_id}`}
                style={{
                  flex: "0 0 auto",
                  width: 160,
                  color: "white",
                  textDecoration: "none",
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.05)",
                  boxShadow: "0 0 8px rgba(0,0,0,0.2)",
                }}
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
        ) : (
          <p style={{ opacity: 0.6, fontSize: 14 }}>Benzer anime bulunamadı.</p>
        )}
      </section>
    </div>
  );
}
