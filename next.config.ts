import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/coding/pitch-showcase",
  assetPrefix: "/coding/pitch-showcase",
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
