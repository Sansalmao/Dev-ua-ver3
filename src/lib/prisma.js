import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error(
    "[prisma] Falta la URL de la base. Define DATABASE_URL (local) o " +
      "TURSO_DATABASE_URL + TURSO_AUTH_TOKEN (producción) en tu .env.",
  );
}

// Caché del cliente entre recargas en desarrollo (globalThis no está tipado).
const globalForPrisma = globalThis;

function createClient() {
  const adapter = new PrismaLibSql({ url, authToken });
  return new PrismaClient({ adapter });
}

/**
 * Cliente Prisma tipado.
 * @type {import("@prisma/client").PrismaClient}
 */
export const prisma = globalForPrisma.__prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma = prisma;
}
