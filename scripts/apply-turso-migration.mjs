// Aplica un archivo migration.sql de prisma/migrations/ directamente contra
// Turso, usando @libsql/client
//
// `npx prisma migrate dev` / `deploy` solo habla con DATABASE_URL, nunca con
// TURSO_DATABASE_URL. Si el proyecto usa Turso en este entorno, cada
// migración nueva hay que aplicarla manualmente — este script
// es la forma de hacerlo sin instalar el CLI de Turso
//

import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@libsql/client";

const migrationName = process.argv[2];
if (!migrationName) {
  console.error(
    "Uso: node scripts/apply-turso-migration.mjs <nombre_de_la_migracion>",
  );
  console.error(
    "Ejemplo: node scripts/apply-turso-migration.mjs 20260715023535_topic_progress",
  );
  process.exit(1);
}

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url || !authToken) {
  console.error(
    "Faltan TURSO_DATABASE_URL y/o TURSO_AUTH_TOKEN en tu .env. Sin esos dos, " +
      "no hay forma de saber contra qué base aplicar la migración.",
  );
  process.exit(1);
}

const sqlPath = path.join(
  "prisma",
  "migrations",
  migrationName,
  "migration.sql",
);

let sql;
try {
  sql = await readFile(sqlPath, "utf8");
} catch (err) {
  console.error(`No pude leer ${sqlPath}: ${err.message}`);
  process.exit(1);
}

const client = createClient({ url, authToken });

console.log(`Aplicando ${sqlPath} contra ${url} ...`);
try {
  await client.executeMultiple(sql);
  console.log("✓ Migración aplicada correctamente.");
} catch (err) {
  console.error("✗ Falló la migración:", err.message);
  process.exit(1);
} finally {
  client.close();
}
