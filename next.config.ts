import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["swiper"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "staging.enjazfile.com" },
      { protocol: "http", hostname: "staging.enjazfile.com" },
      { protocol: "https", hostname: "enjazfile.com" },
      { protocol: "http", hostname: "enjazfile.com" },
    ],
  },
};

export default nextConfig;
