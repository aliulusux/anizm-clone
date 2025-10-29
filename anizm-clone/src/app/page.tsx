import Header from "./components/Header";
import AnimeCard from "./components/AnimeCard";
import AuthGate from "./components/AuthGate";

async function fetchHot(){
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/anidb/hotanime`, { next:{ revalidate:300 }});
  const { items } = await res.json();
  return items.slice(0, 18).map((x:any)=>({ aid:x.aid, title:`Anime #${x.aid}` }));
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
