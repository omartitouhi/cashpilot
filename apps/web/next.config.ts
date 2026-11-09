import { config } from "dotenv";
import type { NextConfig } from "next";

// Une seule source de configuration : le .env à la racine du monorepo.
config({ path: "../../.env" });

const nextConfig: NextConfig = {
  // Les packages internes sont en TypeScript : Next.js les compile.
  transpilePackages: [
    "@cashpilot/domain",
    "@cashpilot/application",
    "@cashpilot/infra",
    "@cashpilot/db",
  ],
  // Justificatif de 2 Mo maximum + les champs du formulaire.
  experimental: { serverActions: { bodySizeLimit: "3mb" } },
};

export default nextConfig;
