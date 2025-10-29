/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.myanimelist.net"], // Jikan’s image host
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
