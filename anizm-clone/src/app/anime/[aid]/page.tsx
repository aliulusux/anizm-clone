import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function fetchAnime(id: string) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    if (!res.ok) throw new Error("Failed to fetch anime details");
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("fetchAnime error:", err);
    return null;
  }
}

async function fetchRelated(id: string) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/relations`);
    if (!res.ok) throw new Error("Failed to fetch related anime");
    const data = await res.json();
    const related =
      data.data
        ?.flatMap((rel: any) => rel.entry)
        ?.filter((a: any) => a.type === "anime") || [];
    return related;
  } catch (err) {
    console.error("fetchRelated error:", err);
    return [];
  }
}

export default async function AnimePage({ params }: { params: { aid: string } }) {
  const anime = await fetchAnime(params.aid);
  const related = await fetchRelated(params.aid);

  if (!anime)
    return (
      <div className="glass" style={{ margin: "40px auto", padding: "24px", width: "90%", textAlign: "center" }}>
        <h2>Anime bulunamadı 😔</h2>
        <Link href="/" className="button">
          Ana Sayfa
        </Link>
      </div>
    );

  return (
    <div className="container" style={{ marginTop: "40px", marginBottom: "60px" }}>
      {/* === MAIN ANIME INFO === */}
      <section
        className="glass"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: "24px",
          padding: "24px",
          borderRadius: "16px",
          marginBottom: "40px",
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <Image
            src={anime.images.jpg.large_image_url}
            alt={anime.title}
            width={250}
            height={360}
            style={{
              borderRadius: "12px",
              objectFit: "cover",
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "10px" }}>{anime.title}</h1>
          <p style={{ opacity: 0.8, marginBottom: "16px" }}>{anime.title_japanese}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
            <span className="badge">Tip: {anime.type || "Bilinmiyor"}</span>
            <span className="badge">Bölümler: {anime.episodes || "?"}</span>
            <span className="badge">Puan: {anime.score || "?"}</span>
            <span className="badge">Yıl: {anime.year || "?"}</span>
          </div>

          <p style={{ lineHeight: 1.6, opacity: 0.9 }}>
            {anime.synopsis || "Bu anime hakkında açıklama bulunamadı."}
          </p>

          {anime.trailer?.url && (
            <div style={{ marginTop: "24px" }}>
              <h3 style={{ marginBottom: "8px" }}>Fragman</h3>
              <iframe
                width="560"
                height="315"
                src={anime.trailer.embed_url}
                title="Anime Trailer"
                allowFullScreen
                style={{
                  border: "none",
                  borderRadius: "12px",
                  width: "100%",
                  maxWidth: "560px",
                  height: "315px",
                }}
              ></iframe>
            </div>
          )}
        </div>
      </section>

      {/* === RELATED ANIME === */}
      {related.length > 0 && (
        <section
          className="glass"
          style={{
            padding: "20px",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>İlgili Animeler</h2>

          <div
            style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              scrollBehavior: "smooth",
              paddingBottom: "10px",
            }}
          >
            {related.map((rel: any) => (
              <Link
                key={rel.mal_id}
                href={`/anime/${rel.mal_id}`}
                style={{
                  flex: "0 0 auto",
                  width: "150px",
                  textAlign: "center",
                  color: "white",
                }}
              >
                <div
                  style={{
                    width: "150px",
                    height: "220px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    marginBottom: "8px",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  {rel.images?.jpg?.image_url ? (
                    <Image
                      src={rel.images.jpg.image_url}
                      alt={rel.name}
                      width={150}
                      height={220}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        opacity: 0.6,
                      }}
                    >
                      Görsel Yok
                    </div>
                  )}
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={rel.name}
                >
                  {rel.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
