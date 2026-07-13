// ============================================================================
//  prisma/seed.js  —  Datos de prueba
// ============================================================================

import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/prisma.js";

const DEV_PASSWORD = "password123";

async function main() {
  console.log("Sembrando base de datos…");

  const passwordHash = await bcrypt.hash(DEV_PASSWORD, 10);

  // ── Limpieza ──────────────────────────────────────────────────────────────
  await prisma.submission.deleteMany();
  await prisma.joinRequest.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.community.deleteMany();
  await prisma.user.deleteMany();

  // ── ADMIN ────────────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      email: "admin@ua.edu",
      passwordHash,
      displayName: "Admin de Plataforma",
      profileType: "PROFESOR",
      teacherVerificationStatus: "VERIFIED",
      isAdmin: true,
    },
  });

  // ── PROFESORES ─────────────────────────────────────────────────────────────
  const profVerificado = await prisma.user.create({
    data: {
      email: "helena.cruz@ua.edu",
      passwordHash,
      displayName: "Prof. Helena Cruz",
      profileType: "PROFESOR",
      teacherVerificationStatus: "VERIFIED",
    },
  });

  const profPendiente = await prisma.user.create({
    data: {
      email: "daniel.reyes@ua.edu",
      passwordHash,
      displayName: "Prof. Daniel Reyes",
      profileType: "PROFESOR",
      teacherVerificationStatus: "PENDING",
    },
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
    const est = await prisma.user.create({
      data: {
        email: e.email,
        passwordHash,
        displayName: e.displayName,
        profileType: "ESTUDIANTE",
        teacherVerificationStatus: "PENDING",
      },
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
}

main()
  .catch((e) => {
    console.error("❌ Error al sembrar:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
