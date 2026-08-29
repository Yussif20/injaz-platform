import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["swiper"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "staging.enjazfile.com" },
      { protocol: "https", hostname: "enjazfile.com" },
    ],
  },
  experimental: {
    // Next.js 16 defaults this to 10 MB, which silently truncates larger
    // multipart uploads and makes request.formData() throw → 500 on image
    // uploads from modern phone cameras. Bumped to 50 MB.
    proxyClientMaxBodySize: "50mb",
  },
};

export default nextConfig;
