import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "staging.enjazfile.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "enjazfile.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
