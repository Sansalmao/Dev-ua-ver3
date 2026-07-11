import { prisma } from "@lib/prisma.js";
import {
  requireUser,
  requireVerifiedTeacher,
  AuthError,
  toErrorResponse,
} from "@lib/auth.js";
import { getUserCommunityContext } from "@lib/community-context.js";

const JOIN_STATUSES = ["PENDING", "APPROVED", "REJECTED"];
const MAX_APPROVED_FOR_TEACHER = 2;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ── T3.5 — Crear solicitud ────────────────────────────────────────────────────
export async function POST({ params, locals }) {
  try {
    const user = requireUser(locals.user);
    const communityId = params.id;

    // La comunidad debe existir.
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true, teacherId: true },
    });
    if (!community) throw new AuthError(404, "Comunidad no encontrada.");

    // No solicitar a la propia comunidad.
    if (community.teacherId === user.userId) {
      throw new AuthError(400, "No puedes solicitar unirte a tu propia comunidad.");
    }

    // (3) ¿Ya existe una solicitud de este usuario a ESTA comunidad?
    //     El @@unique([requesterId, communityId]) lo garantiza en base; aquí
    //     devolvemos un error legible en vez de un fallo de constraint.
    const existingToThis = await prisma.joinRequest.findUnique({
      where: {
        requesterId_communityId: {
          requesterId: user.userId,
          communityId,
        },
      },
      select: { status: true },
    });
    if (existingToThis) {
      throw new AuthError(
        409,
        `Ya tienes una solicitud (${existingToThis.status}) para esta comunidad.`,
      );
    }

    // (1) Una PENDING a la vez, en total.
    const pendingCount = await prisma.joinRequest.count({
      where: { requesterId: user.userId, status: "PENDING" },
    });
    if (pendingCount > 0) {
      throw new AuthError(
        409,
        "Ya tienes una solicitud pendiente. Espera a que se resuelva antes de enviar otra.",
      );
    }

    // (2) Reglas específicas de PROFESOR.
    if (user.profileType === "PROFESOR") {
      const { owned } = await getUserCommunityContext(user.userId);
      if (owned.length > 0) {
        throw new AuthError(
          403,
          "Un profesor con comunidad propia no puede unirse a otras comunidades.",
        );
      }

      const approvedCount = await prisma.joinRequest.count({
        where: { requesterId: user.userId, status: "APPROVED" },
      });
      if (approvedCount >= MAX_APPROVED_FOR_TEACHER) {
        throw new AuthError(
          409,
          `Un profesor puede pertenecer a un máximo de ${MAX_APPROVED_FOR_TEACHER} comunidades.`,
        );
      }
    }

    // Crear (siempre nace PENDING).
    const joinRequest = await prisma.joinRequest.create({
      data: {
        requesterId: user.userId,
        communityId,
        status: "PENDING",
      },
      select: { id: true, communityId: true, status: true, createdAt: true },
    });

    return json({ joinRequest }, 201);
  } catch (error) {
    return toErrorResponse(error);
  }
}

// ── T3.7 — Listar solicitudes de la comunidad (solo el dueño) ─────────────────
export async function GET({ params, request, locals }) {
  try {
    await requireVerifiedTeacher(locals.user);
    const communityId = params.id;

    const community = await prisma.community.findUnique({
      where: { id: communityId },
      select: { teacherId: true },
    });
    if (!community) throw new AuthError(404, "Comunidad no encontrada.");

    // Propiedad: el profesor debe ser dueño de ESTA comunidad.
    if (community.teacherId !== locals.user.userId) {
      throw new AuthError(403, "No eres el dueño de esta comunidad.");
    }

    // Filtro opcional ?status=PENDING
    const url = new URL(request.url);
    const statusParam = url.searchParams.get("status");
    const where = { communityId };
    if (statusParam) {
      if (!JOIN_STATUSES.includes(statusParam)) {
        throw new AuthError(400, "status inválido.");
      }
      where.status = statusParam;
    }

    const requests = await prisma.joinRequest.findMany({
      where,
      select: {
        id: true,
        status: true,
        rejectReason: true,
        createdAt: true,
        requester: {
          select: {
            id: true,
            email: true,
            displayName: true,
            profileType: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return json({ requests });
  } catch (error) {
    return toErrorResponse(error);
  }
}
