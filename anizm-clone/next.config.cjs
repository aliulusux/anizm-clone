/** @type {import('next').NextConfig} */
console.log("✅ Next.js config loaded successfully!");

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
};

module.exports = nextConfig;
