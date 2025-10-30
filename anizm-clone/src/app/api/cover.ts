import { ImageResponse } from "next/og";

export const runtime = "edge";

// 🎨 Generate a deterministic color from title
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 65%, 45%)`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Unknown Anime";
  const seed = searchParams.get("seed") || Math.random().toString();

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "white",
          background: stringToColor(title + seed),
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "20px",
        }}
      >
        {title}
      </div>
    ),
    {
      width: 300,
      height: 450,
    }
  );
}
