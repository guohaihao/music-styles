import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  distDir: isDevelopment ? ".next-dev" : ".next",
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
