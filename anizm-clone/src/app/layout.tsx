export const metadata = { title: "Anizm Clone", description: "AniDB-powered Anime Portal" };
import "./globals.css";
export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
