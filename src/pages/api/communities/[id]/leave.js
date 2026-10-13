import { prisma } from "@lib/prisma.js";
import { requireUser, AuthError, toErrorResponse } from "@lib/auth.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Salir de una comunidad (o retirar una solicitud propia).
 */
export async function POST({ params, locals }) {
  try {
    const user = requireUser(locals.user);
    const communityId = params.id;

    const community = await prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true, teacherId: true },
    });
    if (!community) throw new AuthError(404, "Comunidad no encontrada.");

    if (community.teacherId === user.userId) {
      throw new AuthError(
        400,
        "Eres el dueño de esta comunidad; no puedes abandonarla.",
      );
    }

    const myJoin = await prisma.joinRequest.findUnique({
      where: {
        requesterId_communityId: {
          requesterId: user.userId,
          communityId,
        },
      },
      select: { id: true, status: true },
    });
    if (!myJoin) {
      throw new AuthError(404, "No perteneces a esta comunidad.");
    }

    await prisma.joinRequest.delete({ where: { id: myJoin.id } });

    return json({ ok: true, previousStatus: myJoin.status });
  } catch (error) {
    return toErrorResponse(error);
  }
}
