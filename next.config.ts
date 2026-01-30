import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  ...(process.env.NODE_ENV === 'production' && { output: "standalone" })
};

export default nextConfig;