// ============================================================================
//  prisma/seed.js  —  Datos de prueba
// ============================================================================

import { auth } from "../src/lib/auth-server.js";
import { prisma } from "../src/lib/prisma.js";

const DEV_PASSWORD = "password123";

/** Crea un usuario vía Better Auth y devuelve el registro ya actualizado. */
async function createUser({ email, password = DEV_PASSWORD, displayName, profileType, extra = {} }) {
  const { user } = await auth.api.signUpEmail({
    body: { email, password, name: displayName, profileType },
  });

  return prisma.user.update({
    where: { id: user.id },
    data: { displayName, ...extra },
  });
}

async function main() {
  console.log("Sembrando base de datos…");

  // ── Limpieza ──────────────────────────────────────────────────────────────
  // Session/Account se borran solos por onDelete: Cascade al borrar User.
  await prisma.submission.deleteMany();
  await prisma.joinRequest.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.community.deleteMany();
  await prisma.user.deleteMany();

  // ── ADMIN ────────────────────────────────────────────────────────────────
  const admin = await createUser({
    email: "admin@ua.edu",
    displayName: "Admin de Plataforma",
    profileType: "PROFESOR",
    extra: { teacherVerificationStatus: "VERIFIED", isAdmin: true },
  });

  // ── PROFESORES ─────────────────────────────────────────────────────────────
  const profVerificado = await createUser({
    email: "helena.cruz@ua.edu",
    displayName: "Prof. Helena Cruz",
    profileType: "PROFESOR",
    extra: { teacherVerificationStatus: "VERIFIED" },
  });

  const profPendiente = await createUser({
    email: "daniel.reyes@ua.edu",
    displayName: "Prof. Daniel Reyes",
    profileType: "PROFESOR",
    extra: { teacherVerificationStatus: "PENDING" },
  });

  // ── ESTUDIANTES ────────────────────────────────────────────────────────────
  const estudiantesData = [
    { email: "martin.solis@ua.edu", displayName: "Martín Solís" },
    { email: "valeria.oquendo@ua.edu", displayName: "Valeria Oquendo" },
    { email: "tomas.bracamonte@ua.edu", displayName: "Tomás Bracamonte" },
    { email: "ana.torres@ua.edu", displayName: "Ana Torres" },
    { email: "miguel.soto@ua.edu", displayName: "Miguel Soto" },
  ];

  const estudiantes = [];
  for (const e of estudiantesData) {
    const est = await createUser({
      email: e.email,
      displayName: e.displayName,
      profileType: "ESTUDIANTE",
    });
    estudiantes.push(est);
  }

  // ── COMUNIDADES ────────────────────────────────────────────────────────────
  const commWeb = await prisma.community.create({
    data: {
      name: "UA WG LACNOG",
      topic: "Desarrollo web y redes",
      profileTrack: "STUDENT",
      stage: "IMPLEMENTACION_TECNICA",
      teacherId: profVerificado.id,
    },
  });

  const commNoSql = await prisma.community.create({
    data: {
      name: "Bases de Datos NoSQL",
      topic: "MongoDB y modelado de documentos",
      profileTrack: "STUDENT",
      stage: "CONCEPTOS_CLAVE",
      teacherId: profVerificado.id,
    },
  });

  // ── SOLICITUDES ────────────────────────────────────────────────────────────
  await prisma.joinRequest.create({
    data: {
      requesterId: estudiantes[0].id,
      communityId: commWeb.id,
      status: "APPROVED",
      reviewedById: profVerificado.id,
      reviewedAt: new Date(),
    },
  });

  await prisma.joinRequest.create({
    data: {
      requesterId: estudiantes[1].id,
      communityId: commNoSql.id,
      status: "PENDING",
    },
  });

  // ── RETOS ──────────────────────────────────────────────────────────────────
  await prisma.challenge.createMany({
    data: [
      {
        title: "Introducción a IDNs",
        summary: "Reto base de conceptos clave.",
        requiredStage: "CONCEPTOS_CLAVE",
        communityId: commWeb.id,
      },
      {
        title: "Punycode en producción",
        summary: "Reto avanzado de implementación técnica.",
        requiredStage: "IMPLEMENTACION_TECNICA",
        communityId: commWeb.id,
      },
    ],
  });

  console.log("  Listo. Base de datos poblada correctamente.");
  console.log(`  Login de prueba: cualquier email de arriba + password "${DEV_PASSWORD}"`);
  console.log(`  Admin: admin@ua.edu`);
}

main()
  .catch((e) => {
    console.error("❌ Error al sembrar:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
