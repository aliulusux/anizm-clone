// src/app/api/cover/route.ts
import { NextRequest } from "next/server";

function hsl(n: number) {
  const h = (n * 53) % 360;
  return `hsl(${h} 70% 50%)`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "No Title").slice(0, 80);
  const seed = Number(searchParams.get("seed") || 1);
  const c1 = hsl(seed + 1);
  const c2 = hsl(seed + 7);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="900">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="40"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <g filter="url(#blur)">
    <circle cx="120" cy="160" r="160" fill="white" opacity="0.15"/>
    <circle cx="520" cy="740" r="200" fill="white" opacity="0.12"/>
  </g>
  <rect x="0" y="0" width="640" height="900" fill="black" opacity="0.18"/>
  <foreignObject x="40" y="60" width="560" height="780">
    <div xmlns="http://www.w3.org/1999/xhtml"
      style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif;
             height:100%; display:flex; align-items:center; justify-content:center; text-align:center;
             color:white; font-weight:700; font-size:48px; line-height:1.15; padding:16px;">
      ${title.replace(/&/g, "&amp;").replace(/</g, "&lt;")}
    </div>
  </foreignObject>
</svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
}
