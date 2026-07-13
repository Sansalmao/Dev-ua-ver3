import { prisma } from "@lib/prisma.js";
import { requireVerifiedTeacher, AuthError, toErrorResponse } from "@lib/auth.js";

export async function PATCH({ params, locals }) {
  try {
    await requireVerifiedTeacher(locals.user);
    const id = params.id;

    const community = await prisma.community.findUnique({
      where: { id },
      select: { id: true, teacherId: true, stage: true, graduated: true },
    });
    if (!community) throw new AuthError(404, "Comunidad no encontrada.");

    if (community.teacherId !== locals.user.userId) {
      throw new AuthError(403, "Solo el profesor dueño puede graduar esta comunidad.");
    }

    if (community.graduated) {
      throw new AuthError(409, "La comunidad ya está graduada.");
    }
    if (community.stage !== "IMPLEMENTACION_TECNICA") {
      throw new AuthError(
        409,
        "Solo puede graduarse una comunidad en IMPLEMENTACION_TECNICA.",
      );
    }

    const updated = await prisma.community.update({
      where: { id },
      data: { graduated: true, graduatedAt: new Date() },
      select: {
        id: true,
        name: true,
        stage: true,
        graduated: true,
        graduatedAt: true,
      },
    });

    return new Response(JSON.stringify({ community: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
