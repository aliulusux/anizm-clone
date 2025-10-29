import { NextResponse } from "next/server";
import { getAnimeById } from "./lib/anidb";

export async function GET(_:Request, { params }:{params:{aid:string}}){
  try{
    const data = await getAnimeById(Number(params.aid));
    return NextResponse.json({ data }, { headers:{ "Cache-Control":"s-maxage=600, stale-while-revalidate=1800" }});
  }catch(e:any){
    return NextResponse.json({ error:e.message }, { status:500 });
  }
}
