import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost:3000",
    "10.5.0.2:3000",
    "10.5.0.2",
  ],
};


export default nextConfig;
