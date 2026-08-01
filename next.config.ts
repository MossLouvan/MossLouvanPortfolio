import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * This site is served from Cloudflare, which has no Next image optimizer:
     * /_next/image returned the original bytes unchanged and was a cache MISS
     * on every request. Assets in /public are pre-sized WebP instead, so the
     * proxy hop bought nothing and cost an uncached round trip.
     */
    unoptimized: true,
  },
};

export default nextConfig;
