import { prisma } from "@lib/prisma.js";
import { requireUser, AuthError, toErrorResponse } from "@lib/auth.js";
import { getUserCommunityContext } from "@lib/community-context.js";
import { getMemberProgress } from "@lib/progress.js";

export async function GET({ params, locals }) {
  try {
    const user = requireUser(locals.user);
    const communityId = params.id;

    const community = await prisma.community.findUnique({
      where: { id: communityId },
      select: {
        id: true,
        name: true,
        profileTrack: true,
        stage: true,
        teacher: {
          select: { id: true, email: true, displayName: true },
        },
      },
    });
    if (!community) throw new AuthError(404, "Comunidad no encontrada.");

    // Acceso: dueño ∪ miembro aprobado.
    const { all } = await getUserCommunityContext(user.userId);
    const belongs = all.some((c) => c.id === communityId);
    if (!belongs) throw new AuthError(403, "No perteneces a esta comunidad.");

    // Miembros aprobados.
    const approved = await prisma.joinRequest.findMany({
      where: { communityId, status: "APPROVED" },
      select: {
        reviewedAt: true,
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
      orderBy: { reviewedAt: "asc" },
    });

    // Forma unificada. El dueño va primero con rol OWNER.
    // El progreso se DERIVA de las entregas aprobadas (ver lib/progress.js).
    const communityRef = { id: community.id, stage: community.stage };

    const ownerProgress = await getMemberProgress(community.teacher.id, communityRef);
    const members = [
      {
        id: community.teacher.id,
        email: community.teacher.email,
        displayName: community.teacher.displayName,
        inCommunityRole: "OWNER",
        joinedAt: null, // el dueño no tiene fila de ingreso
        progress: ownerProgress.percent,
      },
    ];

    for (const jr of approved) {
      const p = await getMemberProgress(jr.requester.id, communityRef);
      members.push({
        id: jr.requester.id,
        email: jr.requester.email,
        displayName: jr.requester.displayName,
        inCommunityRole: "MEMBER",
        joinedAt: jr.reviewedAt ?? jr.createdAt,
        progress: p.percent,
      });
    }

    return new Response(
      JSON.stringify({
        community: {
          id: community.id,
          name: community.name,
          profileTrack: community.profileTrack,
          stage: community.stage,
        },
        members,
        memberCount: members.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
