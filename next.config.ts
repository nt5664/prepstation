import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [new URL("https://static-cdn.jtvnw.net/**")],
    qualities: [75, 80, 100],
  },
};

export default nextConfig;
