'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function FavoriteButton({ aid }:{ aid:number }){
  const [userId,setUserId]=useState<string|undefined>(undefined);
  const [isFav,setIsFav]=useState(false);
  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{
      const id = data.user?.id;
      setUserId(id);
      if(id){
        fetch('/api/favorites', { headers:{ 'x-user': id }}).then(r=>r.json()).then(j=>{
          setIsFav( (j.items||[]).some((x:any)=>x.aid===aid) );
        });
      }
    });
  },[aid]);

  const toggle = async () => {
    if(!userId){ alert('Önce giriş yapın'); return; }
    if(isFav){
      await fetch(`/api/favorites/${aid}`, { method:'DELETE', headers:{ 'x-user': userId } });
      setIsFav(false);
    }else{
      await fetch(`/api/favorites/${aid}`, { method:'POST', headers:{ 'x-user': userId } });
      setIsFav(true);
    }
  };

  return (
    <button className="favorite" onClick={toggle}>
      {isFav ? '★ Favorilerde' : '☆ Favorilere Ekle'}
    </button>
  );
}
