import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Les packages internes sont en TypeScript : Next.js les compile.
  transpilePackages: ["@cashpilot/domain"],
};

export default nextConfig;
