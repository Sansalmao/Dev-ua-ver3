import "dotenv/config";
import { readFileSync } from "node:fs";
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
const sqlPath = process.argv[2] ?? "turso-schema.sql";

if (!url) {
  console.error("✗ Falta TURSO_DATABASE_URL en el .env.");
  process.exit(1);
}
if (!authToken) {
  console.error("✗ Falta TURSO_AUTH_TOKEN en el .env.");
  process.exit(1);
}

let sql;
try {
  sql = readFileSync(sqlPath, "utf8");
} catch {
  console.error(`✗ No encontré el archivo SQL en: ${sqlPath}`);
  console.error("  Consigue turso-schema.sql y ponlo en la raíz del proyecto.");
  process.exit(1);
}

const client = createClient({ url, authToken });

try {
  console.log(`→ Conectando a ${url.replace(/\/\/.*@/, "//")} ...`);

  await client.executeMultiple(sql);

  const res = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;",
  );
  const tables = res.rows.map((r) => r.name);
  console.log(`✓ Esquema aplicado. ${tables.length} tablas:`);
  console.log("  " + tables.join(", "));
} catch (err) {
  console.error("✗ Error aplicando el esquema:", err?.message ?? err);
  process.exit(1);
} finally {
  client.close();
}
