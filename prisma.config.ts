import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    // Se ejecuta tras aplicar migraciones (npx prisma migrate dev / db seed).
    seed: "node prisma/seed.js",
  },

  // Requerido por los comandos de Migrate para conectarse a la base.
  datasource: {
    url: env("DATABASE_URL"),
  },
});
