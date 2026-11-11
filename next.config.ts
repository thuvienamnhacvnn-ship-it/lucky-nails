import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: { formats: ["image/webp"], deviceSizes: [390, 640, 768, 1024, 1280, 1440, 1920], qualities: [75, 80, 85] },
  poweredByHeader: false,
};
export default nextConfig;
