/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    serverActions: false,
  },
  // ✅ Add this line:
  dynamicParams: true,
  // ✅ Disable static export
  outputFileTracing: false,
};

module.exports = nextConfig;