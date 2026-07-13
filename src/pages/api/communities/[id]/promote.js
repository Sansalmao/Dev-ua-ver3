import { prisma } from "@lib/prisma.js";
import { requireVerifiedTeacher, AuthError, toErrorResponse } from "@lib/auth.js";

const MIN_COMPLETED_CHALLENGES_TO_PROMOTE = 3;

export async function PATCH({ params, locals }) {
  try {
    await requireVerifiedTeacher(locals.user);
    const id = params.id;

    const community = await prisma.community.findUnique({
      where: { id },
      select: { id: true, teacherId: true, stage: true, graduated: true },
    });
    if (!community) throw new AuthError(404, "Comunidad no encontrada.");

    // Propiedad: nunca se confía en el cliente, se verifica contra la base.
    if (community.teacherId !== locals.user.userId) {
      throw new AuthError(403, "Solo el profesor dueño puede promover esta comunidad.");
    }

    if (community.graduated) {
      throw new AuthError(409, "La comunidad ya está graduada; no puede promoverse.");
    }
    if (community.stage !== "CONCEPTOS_CLAVE") {
      throw new AuthError(409, `La comunidad ya está en ${community.stage}.`);
    }

    // Cuántos retos de la etapa actual tienen al menos una entrega aprobada.
    const completed = await prisma.challenge.count({
      where: {
        communityId: id,
        requiredStage: "CONCEPTOS_CLAVE",
        submissions: { some: { status: "APPROVED" } },
      },
    });

    if (completed < MIN_COMPLETED_CHALLENGES_TO_PROMOTE) {
      throw new AuthError(
        409,
        `Faltan retos completados para promover (${completed}/${MIN_COMPLETED_CHALLENGES_TO_PROMOTE}).`,
      );
    }

    const updated = await prisma.community.update({
      where: { id },
      data: { stage: "IMPLEMENTACION_TECNICA" },
      select: { id: true, name: true, stage: true, graduated: true },
    });

    return new Response(JSON.stringify({ community: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
