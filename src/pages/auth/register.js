import bcrypt from "bcryptjs";
import { prisma } from "@lib/prisma.js";

const PROFILE_TYPES = ["PROFESOR", "ESTUDIANTE"];

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Body JSON inválido." }, 400);
  }

  const { email, password, profileType } = body ?? {};

  // ── Validación ────────────────────────────────────────────────────────────
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return json({ error: "Email inválido." }, 400);
  }
  if (!password || typeof password !== "string" || password.length < 8) {
    return json({ error: "La contraseña debe tener al menos 8 caracteres." }, 400);
  }
  if (!PROFILE_TYPES.includes(profileType)) {
    return json({ error: "profileType debe ser PROFESOR o ESTUDIANTE." }, 400);
  }

  // ── Email único ─────────────────────────────────────────────────────────────
  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true },
  });
  if (existing) {
    return json({ error: "Ya existe una cuenta con ese email." }, 409);
  }

  // ── Crear ───────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      profileType,
      teacherVerificationStatus: "PENDING",
    },
    select: {
      id: true,
      email: true,
      profileType: true,
      teacherVerificationStatus: true,
    },
  });

  return json({ user }, 201);
}
