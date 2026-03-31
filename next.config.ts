import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // compress: true,
  // poweredByHeader: false,
  experimental: {
    // Tree-shake lucide-react icons — only bundle icons actually imported
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // Serve modern formats (WebP/AVIF) when supported
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
