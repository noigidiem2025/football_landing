/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Country flags are served as optimized static images from flagcdn (no API key / backend).
    remotePatterns: [
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // API-Football team / league logos
      { protocol: "https", hostname: "media.api-sports.io" },
    ],
  },
};

export default nextConfig;
