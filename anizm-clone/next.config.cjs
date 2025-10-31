/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // MAL / Jikan covers
      { protocol: 'https', hostname: 'cdn.myanimelist.net', pathname: '/**' },
      // (older mirrors still appear in some dumps; safe to allow)
      { protocol: 'https', hostname: 'myanimelist.cdn-dena.com', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;
