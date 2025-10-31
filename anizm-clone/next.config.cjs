/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
        port: "",
        pathname: "/**", // allow all paths
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
};

module.exports = nextConfig;
