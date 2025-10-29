'use client';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AuthGate(){
  const [userId,setUserId]=useState<string|undefined>(undefined);
  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>setUserId(data.user?.id));
    const { data: sub } = supabase.auth.onAuthStateChange((_e,session)=> setUserId(session?.user?.id));
    return ()=>{ sub?.subscription.unsubscribe(); };
  },[]);

  const login = async () => { await supabase.auth.signInWithOAuth({ provider:'github' }); };
  const logout = async () => { await supabase.auth.signOut(); location.reload(); };

  return (
    <div className="row">
      {userId ? <span className="badge">Giriş: {userId.slice(0,8)}…</span> : <span className="badge">Giriş yapılmadı</span>}
      {!userId && <button className="button" onClick={login}>GitHub ile Giriş</button>}
      {userId && <button className="button" onClick={logout}>Çıkış</button>}
    </div>
  );
}

export async function getUserId(): Promise<string|undefined>{
  const { data } = await supabase.auth.getUser();
  return data.user?.id;
}
