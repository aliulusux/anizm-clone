import { NextResponse } from "next/server";
import { getHotAnime } from "@/lib/anidb";

export async function GET() {
  const data = await getHotAnime();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
    },
  });
}
