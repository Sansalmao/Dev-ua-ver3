import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    // Se ejecuta tras aplicar migraciones (npx prisma migrate dev / db seed).
    seed: "node prisma/seed.js",
  },

  datasource: {
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
});
