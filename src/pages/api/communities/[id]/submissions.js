import { prisma } from "@lib/prisma.js";
import { requireUser, AuthError, toErrorResponse } from "@lib/auth.js";
import { getUserCommunityContext } from "@lib/community-context.js";

const STATUSES = ["PENDING", "APPROVED", "REJECTED"];

export async function GET({ params, request, locals }) {
  try {
    const user = requireUser(locals.user);
    const communityId = params.id;

    const community = await prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true },
    });
    if (!community) throw new AuthError(404, "Comunidad no encontrada.");

    const { all } = await getUserCommunityContext(user.userId);
    const belongs = all.some((c) => c.id === communityId);
    if (!belongs) throw new AuthError(403, "No perteneces a esta comunidad.");

    // Filtros.
    const url = new URL(request.url);
    const statusParam = url.searchParams.get("status");
    const langParam = url.searchParams.get("language");

    const where = { challenge: { communityId } };
    if (statusParam) {
      if (!STATUSES.includes(statusParam)) throw new AuthError(400, "status inválido.");
      where.status = statusParam;
    }
    if (langParam) where.language = langParam;

    const submissions = await prisma.submission.findMany({
      where,
      select: {
        id: true,
        status: true,
        repoUrl: true,
        language: true,
        rating: true,
        createdAt: true,
        challenge: { select: { id: true, title: true, requiredStage: true } },
        author: { select: { id: true, displayName: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return new Response(JSON.stringify({ submissions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
