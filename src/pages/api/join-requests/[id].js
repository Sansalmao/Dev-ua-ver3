import { prisma } from "@lib/prisma.js";
import {
  requireVerifiedTeacher,
  AuthError,
  toErrorResponse,
} from "@lib/auth.js";

const ACTION_TO_STATUS = {
  APPROVE: "APPROVED",
  REJECT: "REJECTED",
};

export async function PATCH({ params, request, locals }) {
  try {
    await requireVerifiedTeacher(locals.user);
    const id = params.id;

    let body;
    try {
      body = await request.json();
    } catch {
      throw new AuthError(400, "Body JSON inválido.");
    }

    const newStatus = ACTION_TO_STATUS[body?.action];
    if (!newStatus) {
      throw new AuthError(400, "action debe ser APPROVE o REJECT.");
    }

    // Cargar la solicitud junto con el dueño de su comunidad.
    const jr = await prisma.joinRequest.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        community: { select: { teacherId: true } },
      },
    });
    if (!jr) throw new AuthError(404, "Solicitud no encontrada.");

    // Propiedad: el profesor debe ser dueño de la comunidad de la solicitud.
    if (jr.community.teacherId !== locals.user.userId) {
      throw new AuthError(403, "No puedes resolver solicitudes de otra comunidad.");
    }

    // Solo se resuelven solicitudes que sigan pendientes.
    if (jr.status !== "PENDING") {
      throw new AuthError(409, `La solicitud ya fue resuelta (${jr.status}).`);
    }

    const updated = await prisma.joinRequest.update({
      where: { id },
      data: {
        status: newStatus,
        rejectReason:
          newStatus === "REJECTED" ? (body.rejectReason ?? null) : null,
        reviewedById: locals.user.userId,
        reviewedAt: new Date(),
      },
      select: {
        id: true,
        status: true,
        rejectReason: true,
        reviewedAt: true,
      },
    });

    return new Response(JSON.stringify({ joinRequest: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
