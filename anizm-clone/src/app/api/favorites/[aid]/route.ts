import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function POST(req:NextRequest, { params }:{params:{aid:string}}){
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, key);
  const userId = req.headers.get("x-user") || "";
  if(!userId) return NextResponse.json({ok:false}, {status:401});
  const { error } = await supabase.from("favorites").upsert({ user_id:userId, aid:Number(params.aid) }, { onConflict:"user_id,aid" });
  if(error) return NextResponse.json({ ok:false, error:error.message }, { status:500 });
  return NextResponse.json({ ok:true });
}
export async function DELETE(req:NextRequest, { params }:{params:{aid:string}}){
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, key);
  const userId = req.headers.get("x-user") || "";
  if(!userId) return NextResponse.json({ok:false}, {status:401});
  const { error } = await supabase.from("favorites").delete().eq("user_id", userId).eq("aid", Number(params.aid));
  if(error) return NextResponse.json({ ok:false, error:error.message }, { status:500 });
  return NextResponse.json({ ok:true });
}
