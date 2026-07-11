import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Añadiendo retos de prueba…");

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
  console.log(`Retos sembrados. Total en la base: ${total}`);

  // ── ENTREGAS DE PRUEBA (soluciones) ────────────────────────────────────────
  // Sembramos algunas entregas de miembros aprobados de commWeb, en distintos
  // estados, para probar la vista de soluciones y el progreso derivado.
  const martin = await prisma.user.findUnique({
    where: { email: "martin.solis@ua.edu" },
    select: { id: true },
  });

  // Retos de commWeb que ya existen.
  const retosWeb = await prisma.challenge.findMany({
    where: { communityId: commWeb.id },
    select: { id: true, requiredStage: true },
    orderBy: { createdAt: "asc" },
  });

  if (martin && retosWeb.length >= 2) {
    // Primera entrega: aprobada (cuenta para progreso).
    await prisma.submission.upsert({
      where: {
        challengeId_authorId: { challengeId: retosWeb[0].id, authorId: martin.id },
      },
      create: {
        challengeId: retosWeb[0].id,
        authorId: martin.id,
        repoUrl: "https://github.com/martin/solucion-1",
        language: "python",
        status: "APPROVED",
        rating: 4.8,
      },
      update: {},
    });

    // Segunda entrega: pendiente de revisión.
    await prisma.submission.upsert({
      where: {
        challengeId_authorId: { challengeId: retosWeb[1].id, authorId: martin.id },
      },
      create: {
        challengeId: retosWeb[1].id,
        authorId: martin.id,
        repoUrl: "https://github.com/martin/solucion-2",
        language: "java",
        status: "PENDING",
      },
      update: {},
    });

    const totalSub = await prisma.submission.count();
    console.log(`✅  Entregas sembradas. Total en la base: ${totalSub}`);
  }
}

main()
  .catch((e) => {
    console.error("❌  Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
