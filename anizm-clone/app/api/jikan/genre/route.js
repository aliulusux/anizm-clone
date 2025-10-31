import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 1;
    const slug = params.slug;

    const genreUrl = `https://api.jikan.moe/v4/anime?genres=${slug}&page=${page}&limit=24`;
    const res = await fetch(genreUrl);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error("Genre API Error:", err);
    return NextResponse.json({ error: "Failed to fetch genre" }, { status: 500 });
  }
}
