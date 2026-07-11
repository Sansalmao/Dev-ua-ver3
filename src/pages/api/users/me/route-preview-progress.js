import { prisma } from "@lib/prisma.js";
import { requireUser, toErrorResponse } from "@lib/auth.js";
import { getUserCommunityContext } from "@lib/community-context.js";

export async function PATCH({ locals }) {
  try {
    const user = requireUser(locals.user);

    // Exención automática: ya pertenece a una comunidad de etapa 2.
    const { all } = await getUserCommunityContext(user.userId);
    const enEtapa2 = all.some((c) => c.stage === "IMPLEMENTACION_TECNICA");

    const updated = await prisma.user.update({
      where: { id: user.userId },
      data: { hasCompletedRouteAPreview: true },
      select: { id: true, hasCompletedRouteAPreview: true },
    });

    return new Response(
      JSON.stringify({
        ...updated,
        exemptedByStage2: enEtapa2,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
