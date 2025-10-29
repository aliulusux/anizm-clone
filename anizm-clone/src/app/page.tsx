import Header from "@/components/Header";
import AnimeCard from "@/components/AnimeCard";
import AuthGate from "@/components/AuthGate";

export const dynamic = "force-dynamic";

async function fetchHot() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL ? '' : 'http://localhost:3000'}/api/anidb/hotanime`, { next: { revalidate: 300 } });

  if (!res.ok) {
    console.error("Fetch failed:", res.status, await res.text());
    throw new Error("Failed to fetch AniDB hotanime");
  }

  let items;
  try {
    items = await res.json();
  } catch (err) {
    console.error("Invalid JSON response:", await res.text());
    throw new Error("Invalid JSON from API");
  }

  return items.slice(0, 18).map((x: any) => ({ aid: x.aid, title: `Anime #${x.aid}` }));
}

export default async function Home(){
  const hot = await fetchHot();
  return (
    <div>
      <Header />
      <main className="container">
        <section className="glass" style={{padding:"18px", marginBottom:18}}>
          <AuthGate />
        </section>
        <section className="glass" style={{padding:"18px"}}>
          <h2 style={{margin:"6px 0 12px 0"}}>Bu Sezon Popüler</h2>
          <div className="grid">
            {hot.map((a:any)=>(<AnimeCard key={a.aid} aid={a.aid} title={a.title} />))}
          </div>
        </section>
      </main>
    </div>
  )
}
