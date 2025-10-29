import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req:NextRequest){
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, key);
  const userId = req.headers.get("x-user") || "";
  if(!userId) return NextResponse.json({ items:[] });
  const { data, error } = await supabase.from("favorites").select("*").eq("user_id", userId).order("created_at",{ascending:false});
  if(error) return NextResponse.json({ items:[], error:error.message }, { status:500 });
  return NextResponse.json({ items:data||[] });
}
