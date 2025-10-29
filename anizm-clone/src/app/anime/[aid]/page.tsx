import Image from "next/image";

/* --------------------------- helpers / fetchers --------------------------- */

async function safeFetch(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

async function fetchAnime(id: string) {
  return await safeFetch(`https://api.jikan.moe/v4/anime/${id}/full`);
}

async function fetchEpisodes(id: string) {
  const ep = await safeFetch(`https://api.jikan.moe/v4/anime/${id}/episodes`);
  return Array.isArray(ep) ? ep : [];
}

async function fetchRelatedRaw(id: string) {
  const rel = await safeFetch(`https://api.jikan.moe/v4/anime/${id}/relations`);
  return Array.isArray(rel) ? rel : [];
}

// Fetch minimal anime info (title + cover) for a mal_id
async function fetchMiniAnime(malId: number) {
  const d = await safeFetch(`https://api.jikan.moe/v4/anime/${malId}`);
  if (!d) return null;
  return {
    mal_id: d.mal_id,
    title: d.title || d.title_english || d.title_japanese || "Bilinmiyor",
    image:
      d.images?.jpg?.large_image_url ||
      d.images?.jpg?.image_url ||
      d.images?.webp?.large_image_url ||
      d.images?.webp?.image_url ||
      "",
  };
}

// Limit concurrency so Jikan doesn’t rate-limit too hard
async function pAllLimit<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const ret: R[] = [];
  let i = 0;
  const runners = new Array(Math.min(limit, items.length)).fill(0).map(async () => {
    while (i < items.length) {
      const idx = i++;
      const r = await worker(items[idx]);
      if (r) ret.push(r);
    }
  });
  await Promise.all(runners);
  return ret;
}

async function fetchRelatedWithCovers(id: string) {
  const rel = await fetchRelatedRaw(id);
  const entries = rel
    .flatMap((r: any) => r.entry)
    .filter((a: any) => a?.type === "anime");

  // de-dup + take first 12
  const uniqueIds = Array.from(
    new Set(entries.map((e: any) => Number(e.mal_id)).filter(Boolean))
  ).slice(0, 12);

  const mini = await pAllLimit(uniqueIds, 4, (mid) => fetchMiniAnime(mid));
  return mini.filter(Boolean) as Array<{ mal_id: number; title: string; image: string }>;
}

/* --------------------------------- page ---------------------------------- */

export default async function AnimePage({ params }: { params: { aid: string } }) {
  const [anime, episodes, related] = await Promise.all([
    fetchAnime(params.aid),
    fetchEpisodes(params.aid),
    fetchRelatedWithCovers(params.aid),
  ]);

  if (!anime) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "20vh", opacity: 0.8 }}>
        Bu anime yüklenemedi veya bulunamadı.
      </div>
    );
  }

  const cover =
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    anime.images?.webp?.large_image_url ||
    anime.images?.webp?.image_url ||
    "";

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* BG hero blur */}
      {cover && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${cover})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(30px)",
              transform: "scale(1.1)",
              opacity: 0.25,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(1200px 380px at 50% -80px, rgba(145,78,255,0.35), transparent 60%)",
            }}
          />
        </>
      )}

      <div style={{ position: "relative", zIndex: 1, padding: "28px 16px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          {/* Header */}
          <section
            style={{
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
              marginBottom: 28,
            }}
          >
            {cover && (
              <div
                style={{
                  width: 220,
                  height: 320,
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.16)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                  flex: "0 0 auto",
                }}
              >
                <Image
                  src={cover}
                  alt={anime.title}
                  width={220}
                  height={320}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
            )}

            <div
              style={{
                flex: 1,
                minWidth: 260,
                color: "white",
                padding: 18,
                borderRadius: 18,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
                backdropFilter: "blur(10px)",
              }}
            >
              <h1 style={{ fontSize: 28, margin: 0, marginBottom: 8 }}>{anime.title}</h1>
              <p style={{ opacity: 0.85, lineHeight: 1.6, marginTop: 6 }}>
                {anime.synopsis || "Açıklama bulunamadı."}
              </p>
            </div>
          </section>

          {/* Episodes */}
          {episodes?.length > 0 && (
            <section
              style={{
                padding: 18,
                borderRadius: 18,
                marginBottom: 26,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
                color: "white",
                backdropFilter: "blur(10px)",
              }}
            >
              <h2 style={{ fontSize: 20, margin: 0, marginBottom: 12 }}>Bölümler</h2>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  overflowX: "auto",
                  paddingBottom: 8,
                  scrollbarWidth: "thin" as any,
                }}
              >
                {episodes.map((ep: any) => (
                  <div
                    key={ep.mal_id || ep.episode_id || `${ep.title}-${ep.aired}`}
                    style={{
                      flex: "0 0 auto",
                      minWidth: 220,
                      padding: 12,
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.28)",
                    }}
                  >
                    <strong style={{ display: "block", marginBottom: 6 }}>
                      Bölüm {ep.mal_id || ep.mal || ep.number}: {ep.title}
                    </strong>
                    <p style={{ opacity: 0.75, fontSize: 13, margin: 0 }}>
                      {ep.aired ? new Date(ep.aired).toLocaleDateString() : "-"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related */}
          <section
            style={{
              padding: 18,
              borderRadius: 18,
              marginBottom: 26,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
              color: "white",
              backdropFilter: "blur(10px)",
            }}
          >
            <h2 style={{ fontSize: 20, margin: 0, marginBottom: 12 }}>Benzer Animeler</h2>

            {related.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: 14,
                }}
              >
                {related.map((r) => (
                  <a
                    key={r.mal_id}
                    href={`/anime/${r.mal_id}`}
                    style={{
                      textDecoration: "none",
                      color: "white",
                      borderRadius: 14,
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform .15s ease",
                    }}
                  >
                    <div style={{ width: "100%", aspectRatio: "3 / 4", position: "relative" }}>
                      {r.image ? (
                        <Image
                          src={r.image}
                          alt={r.title}
                          fill
                          sizes="150px"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "grid",
                            placeItems: "center",
                            background: "rgba(0,0,0,0.3)",
                          }}
                        >
                          Görsel Yok
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "10px 10px 12px" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 14,
                          lineHeight: 1.35,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          textAlign: "center",
                        }}
                      >
                        {r.title}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p style={{ opacity: 0.7, margin: 0 }}>Benzer anime bulunamadı.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
