import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const url =
  process.env.TURSO_DATABASE_URL ||
  process.env.DATABASE_URL ||
  "file:./dev.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

const libsql = createClient({ url, authToken });
const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱  Añadiendo retos de prueba…");

  const communities = await prisma.community.findMany({
    select: { id: true, name: true, stage: true },
  });

  const byName = (n) => communities.find((c) => c.name === n);

  const commWeb = byName("UA WG LACNOG"); // IMPLEMENTACION_TECNICA
  const commNoSql = byName("Bases de Datos NoSQL"); // CONCEPTOS_CLAVE

  if (!commWeb || !commNoSql) {
    console.error(
      "❌  Faltan comunidades del seed principal. Corre primero node prisma/seed.js",
    );
    process.exit(1);
  }

  await prisma.challenge.createMany({
    data: [
      // Comunidad avanzada (impl): tiene retos de ambas etapas → miembro ve todo.
      {
        title: "Normalización Unicode en pipelines",
        summary: "Reto de conceptos clave.",
        requiredStage: "CONCEPTOS_CLAVE",
        communityId: commWeb.id,
      },
      {
        title: "IDNA2008 en un resolver propio",
        summary: "Reto avanzado de implementación técnica.",
        requiredStage: "IMPLEMENTACION_TECNICA",
        communityId: commWeb.id,
      },

      // Comunidad en conceptos clave: un reto de impl que NO debe verse (T4.3).
      {
        title: "Conceptos: qué es un IDN",
        summary: "Reto visible para conceptos clave.",
        requiredStage: "CONCEPTOS_CLAVE",
        communityId: commNoSql.id,
      },
      {
        title: "[OCULTO] Punycode a bajo nivel",
        summary:
          "Reto de IMPLEMENTACION_TECNICA en comunidad de CONCEPTOS_CLAVE: " +
          "no debe aparecer a los miembros hasta que la comunidad avance.",
        requiredStage: "IMPLEMENTACION_TECNICA",
        communityId: commNoSql.id,
      },
    ],
  });

  const total = await prisma.challenge.count();
  console.log(`✅  Listo. Total de retos en la base: ${total}`);
}

main()
  .catch((e) => {
    console.error("❌  Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
