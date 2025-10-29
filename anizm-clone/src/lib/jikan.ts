// lib/jikan.ts
type JikanRelationEntry = { mal_id: number; type?: string; name?: string };
type JikanRelation = { relation: string; entry: JikanRelationEntry[] };

const RELATION_ALLOW = new Set([
  "Sequel",
  "Prequel",
  "Parent story",
  "Side story",
  "Alternative version",
  "Alternative setting",
  "Summary",
  "Spin-off",
]);

export async function getRelatedAnimeWithCovers(aid: number) {
  try {
    // 1) Fetch relations
    const relRes = await fetch(`https://api.jikan.moe/v4/anime/${aid}/relations`, {
      cache: "no-store",
    });
    if (!relRes.ok) return [];

    const relJson = (await relRes.json()) as { data?: JikanRelation[] };
    const relations = Array.isArray(relJson.data) ? relJson.data : [];

    // 2) Pick only allowed relation types and flatten to entries
    const entries = relations
      .filter((r) => RELATION_ALLOW.has(r.relation))
      .flatMap((r) => r.entry)
      .filter((e) => (e.type || "").toLowerCase() === "anime");

    // 3) Dedupe IDs and cap how many we fetch (avoid rate-limits)
    const ids = Array.from(new Set(entries.map((e) => e.mal_id))).slice(0, 12);

    // 4) Fetch minimal info for each related anime
    const items: { aid: number; title: string; image?: string | null }[] = [];
    for (const id of ids) {
      const d = await fetch(`https://api.jikan.moe/v4/anime/${id}`, {
        // cache cover/title for a day – relations don’t change often
        next: { revalidate: 86400 },
      }).then((r) => (r.ok ? r.json() : null)).catch(() => null);

      const data = d?.data;
      if (!data) continue;

      items.push({
        aid: data.mal_id,
        title: data.title || data.title_english || data.title_japanese || "Unknown",
        image:
          data.images?.webp?.image_url ||
          data.images?.jpg?.image_url ||
          null,
      });

      // If you ever hit “429 Too Many Requests”, uncomment this small delay:
      // await new Promise(res => setTimeout(res, 400));
    }

    return items;
  } catch {
    return [];
  }
}
