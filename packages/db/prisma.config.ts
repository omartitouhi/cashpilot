import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Le fichier .env est à la racine du monorepo.
config({ path: "../../.env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
