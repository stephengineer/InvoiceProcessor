import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Base path for GitHub Pages (update with your repository name)
  // basePath: '/invoice-processor',
  // assetPrefix: '/invoice-processor',
};

export default nextConfig;
