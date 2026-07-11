import { prisma } from "@lib/prisma.js";
import { requireUser, AuthError, toErrorResponse } from "@lib/auth.js";

const ACTION_TO_STATUS = {
  APPROVE: "APPROVED",
  REJECT: "REJECTED",
};

export async function PATCH({ params, request, locals }) {
  try {
    const user = requireUser(locals.user);
    const id = params.id;

    let body;
    try {
      body = await request.json();
    } catch {
      throw new AuthError(400, "Body JSON inválido.");
    }

    const newStatus = ACTION_TO_STATUS[body?.action];
    if (!newStatus) throw new AuthError(400, "action debe ser APPROVE o REJECT.");

    // rating opcional, entre 0 y 5.
    let rating = null;
    if (body.rating !== undefined && body.rating !== null) {
      rating = Number(body.rating);
      if (Number.isNaN(rating) || rating < 0 || rating > 5) {
        throw new AuthError(400, "rating debe estar entre 0 y 5.");
      }
    }

    // Cargar entrega + dueño de la comunidad del reto.
    const submission = await prisma.submission.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        challenge: { select: { community: { select: { teacherId: true } } } },
      },
    });
    if (!submission) throw new AuthError(404, "Entrega no encontrada.");

    // [ROLES] — autorización provisional: solo el dueño de la comunidad.
    // Al integrar la capa de roles, sustituir por un chequeo tipo
    // canReviewSubmissions(user, communityId) que contemple los roles internos.
    const ownerId = submission.challenge.community.teacherId;
    if (ownerId !== user.userId) {
      throw new AuthError(403, "No tienes permiso para revisar esta entrega.");
    }

    const updated = await prisma.submission.update({
      where: { id },
      data: {
        status: newStatus,
        rating: newStatus === "APPROVED" ? rating : null,
        rejectReason: newStatus === "REJECTED" ? (body.rejectReason ?? null) : null,
        reviewedById: user.userId,
        reviewedAt: new Date(),
      },
      select: {
        id: true,
        status: true,
        rating: true,
        rejectReason: true,
        reviewedAt: true,
      },
    });

    return new Response(JSON.stringify({ submission: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
