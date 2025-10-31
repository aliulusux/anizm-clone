/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: false,
  },
  output: "standalone",
  reactStrictMode: true,
};

module.exports = nextConfig;