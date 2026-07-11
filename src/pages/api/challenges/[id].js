import { prisma } from "@lib/prisma.js";
import { requireUser, AuthError, toErrorResponse } from "@lib/auth.js";
import { getUserCommunityContext } from "@lib/community-context.js";
import { stageAllows } from "@lib/stages.js";

export async function GET({ params, locals }) {
  try {
    const user = requireUser(locals.user);
    const challengeId = params.id;

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      select: {
        id: true,
        title: true,
        summary: true,
        requiredStage: true,
        community: { select: { id: true, stage: true } },
      },
    });
    if (!challenge) throw new AuthError(404, "Reto no encontrado.");

    // ¿Pertenece a la comunidad del reto? (dueño ∪ miembro)
    const { all } = await getUserCommunityContext(user.userId);
    const belongs = all.some((c) => c.id === challenge.community.id);
    if (!belongs) {
      throw new AuthError(403, "No perteneces a la comunidad de este reto.");
    }

    // Etapa: la comunidad debe haber desbloqueado la etapa del reto.
    if (!stageAllows(challenge.community.stage, challenge.requiredStage)) {
      throw new AuthError(403, "Este reto pertenece a una etapa aún no desbloqueada.");
    }

    // Se devuelve sin el objeto community anidado.
    const { community, ...data } = challenge;
    return new Response(JSON.stringify({ challenge: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
