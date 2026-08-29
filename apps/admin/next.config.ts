import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
      {
        protocol: "https",
        hostname: "enjazmo3alem-staging.s3.us-east-005.backblazeb2.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
