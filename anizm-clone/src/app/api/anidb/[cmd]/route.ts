import { NextRequest, NextResponse } from "next/server";
import { getHotAnime } from "./lib/anidb";

export async function GET(_:NextRequest, { params }:{params:{cmd:string}}){
  try{
    if(params.cmd==="hotanime"){
      const items = await getHotAnime();
      return NextResponse.json({ items }, { headers:{ "Cache-Control":"s-maxage=300, stale-while-revalidate=600" }});
    }
    return NextResponse.json({ error:"unsupported" }, { status:400 });
  }catch(e:any){
    return NextResponse.json({ error:e.message }, { status:500 });
  }
}
