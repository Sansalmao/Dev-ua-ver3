import { prisma } from "@lib/prisma.js";
import {
  requireUser,
  AuthError,
  toErrorResponse,
} from "@lib/auth.js";
import { getUserCommunityContext } from "@lib/community-context.js";
import { unlockedStages } from "@lib/stages.js";

export async function GET({ params, locals }) {
  try {
    const user = requireUser(locals.user);
    const communityId = params.id;

    const community = await prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true, stage: true },
    });
    if (!community) throw new AuthError(404, "Comunidad no encontrada.");

    // F-C1: "pertenezco" = dueño ∪ miembro aprobado.
    const { all } = await getUserCommunityContext(user.userId);
    const belongs = all.some((c) => c.id === communityId);
    if (!belongs) {
      throw new AuthError(403, "No perteneces a esta comunidad.");
    }

    // T4.3: solo etapas desbloqueadas por la etapa actual de la comunidad.
    const stages = unlockedStages(community.stage);

    const challenges = await prisma.challenge.findMany({
      where: {
        communityId,
        requiredStage: { in: stages },
      },
      select: {
        id: true,
        title: true,
        summary: true,
        requiredStage: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return new Response(JSON.stringify({ challenges }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
