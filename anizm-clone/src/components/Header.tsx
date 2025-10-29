"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Header(){
  const router = useRouter();
  const sp = useSearchParams();
  const [q,setQ] = useState(sp.get("q") ?? "");
  const onSearch = () => router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
  return (
    <header className="glass header">
      <div className="title">
        <Image src="/logo.svg" alt="logo" width={120} height={32} />
      </div>
      <div style={{flex:1, maxWidth:680, margin:"0 16px"}}>
        <div className="search">
          <input placeholder="Anime ara..." value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onSearch()} />
          <button className="button" onClick={onSearch}>Ara</button>
        </div>
      </div>
      <div className="row">
        <Link href="/"><span className="badge">Ana Sayfa</span></Link>
        <Link href="/?hot=1"><span className="badge">Popüler</span></Link>
        <Link href="/favorites"><span className="badge">Favoriler</span></Link>
      </div>
    </header>
  );
}
