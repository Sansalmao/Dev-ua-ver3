import { prisma } from "@lib/prisma.js";
import {
  requireUser,
  requireVerifiedTeacher,
  AuthError,
  toErrorResponse,
} from "@lib/auth.js";

const PROFILE_TRACKS = ["TEACHER", "STUDENT"];

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ── T3.2 — Listado ────────────────────────────────────────────────────────────
export async function GET({ locals }) {
  try {
    requireUser(locals.user);

    const communities = await prisma.community.findMany({
      select: {
        id: true,
        name: true,
        topic: true,
        profileTrack: true,
        stage: true,
        graduated: true,
        createdAt: true,
        teacher: { select: { id: true, displayName: true } },
        // Conteo de miembros APROBADOS (no cuenta pendientes ni rechazados).
        _count: {
          select: { joinRequests: { where: { status: "APPROVED" } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Renombrar _count.joinRequests → memberCount para una respuesta limpia.
    const result = communities.map((c) => {
      const { _count, ...rest } = c;
      return { ...rest, memberCount: _count.joinRequests };
    });

    return json({ communities: result });
  } catch (error) {
    return toErrorResponse(error);
  }
}

// ── T3.1 — Creación ───────────────────────────────────────────────────────────
export async function POST({ request, locals }) {
  try {
    await requireVerifiedTeacher(locals.user);

    let body;
    try {
      body = await request.json();
    } catch {
      throw new AuthError(400, "Body JSON inválido.");
    }

    const { name, topic, profileTrack } = body ?? {};

    if (!name || typeof name !== "string" || name.trim().length < 3) {
      throw new AuthError(400, "El nombre es obligatorio (mín. 3 caracteres).");
    }
    if (!topic || typeof topic !== "string" || topic.trim().length < 3) {
      throw new AuthError(400, "El tema es obligatorio (mín. 3 caracteres).");
    }
    if (!PROFILE_TRACKS.includes(profileTrack)) {
      throw new AuthError(400, "profileTrack debe ser TEACHER o STUDENT.");
    }

    const community = await prisma.community.create({
      data: {
        name: name.trim(),
        topic: topic.trim(),
        profileTrack,
        // ── CLAVE (T3.1): stage jamás del body. Siempre nace en conceptos clave.
        stage: "CONCEPTOS_CLAVE",
        teacherId: locals.user.userId,
      },
      select: {
        id: true,
        name: true,
        topic: true,
        profileTrack: true,
        stage: true,
        teacherId: true,
      },
    });

    return json({ community }, 201);
  } catch (error) {
    return toErrorResponse(error);
  }
}
