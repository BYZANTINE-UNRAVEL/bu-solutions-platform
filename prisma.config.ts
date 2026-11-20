import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Not required by `prisma generate`, so the Docker build works without a database.
  datasource: { url: process.env.DATABASE_URL ?? "" },
});
