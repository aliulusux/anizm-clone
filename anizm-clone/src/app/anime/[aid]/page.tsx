async function fetchRelatedWithCovers(id: string) {
  try {
    const relRes = await fetch(`https://api.jikan.moe/v4/anime/${id}/relations`);
    if (!relRes.ok) throw new Error("Failed to fetch related anime");
    const relJson = await relRes.json();

    // Extract IDs safely (no optional chaining inside expressions)
    let ids: number[] = [];
    if (relJson.data && Array.isArray(relJson.data)) {
      for (const rel of relJson.data) {
        if (rel.entry && Array.isArray(rel.entry)) {
          for (const e of rel.entry) {
            if (e.type === "anime" && e.mal_id) ids.push(e.mal_id);
          }
        }
      }
    }

    // De-duplicate and cap
    const unique = Array.from(new Set(ids)).slice(0, 16);

    // Fetch details to get covers
    const detailed = await Promise.all(
      unique.map(async (malId) => {
        try {
          const d = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);
          if (!d.ok) return null;
          const dj = await d.json();
          return dj.data;
        } catch {
          return null;
        }
      })
    );

    return detailed.filter(Boolean);
  } catch (err) {
    console.error("fetchRelatedWithCovers error:", err);
    return [];
  }
}
