/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.myanimelist.net' },
      { protocol: 'https', hostname: 'api-cdn.myanimelist.net' }
    ]
  },
  experimental: { optimizePackageImports: ['framer-motion'] }
};

export default nextConfig;
