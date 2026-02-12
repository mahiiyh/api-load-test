import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Static HTML export for Cloudflare Pages
  images: {
    unoptimized: true,  // Required for static export
  },
  trailingSlash: true,  // Better routing on CDN
  reactCompiler: true,
};

export default nextConfig;
