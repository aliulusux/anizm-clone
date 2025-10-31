/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net", // ✅ Jikan images come from here
      },
      {
        protocol: "https",
        hostname: "cdn.myanimelist.net",
        pathname: "/images/**", // ✅ allow all anime images
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
