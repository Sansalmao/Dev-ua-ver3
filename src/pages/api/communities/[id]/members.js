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
        role: true,
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

    const communityRef = { id: community.id, stage: community.stage };

    // ── RBAC (server-side) ───────────────────────────────────────────────────
    // El rol del solicitante EN ESTA comunidad se resuelve contra la base, nunca
    // con lo que manda el cliente. El dueño es ADMIN de forma derivada.
    //
    // Reglas:
    //   • ADMIN / MANAGER → ven el listado completo (con ruta y progreso).
    //   • MEMBER          → solo su propia fila.
    //
    // Antes esto se filtraba SOLO en el navegador: la API devolvía los datos de
    // todos los miembros a cualquiera con la consola abierta.
    const isOwner = community.teacher.id === user.userId;
    const myJoin = approved.find((jr) => jr.requester.id === user.userId);
    const viewerRole = isOwner ? "ADMIN" : (myJoin?.role ?? "MEMBER");
    const canSeeAll = viewerRole === "ADMIN" || viewerRole === "MANAGER";

    // El total sí es visible para todos (es un agregado, no datos de nadie).
    const memberCount = approved.length + 1;

    const ownerEntry = async () => {
      const p = await getMemberProgress(community.teacher.id, communityRef);
      return {
        id: community.teacher.id,
        email: community.teacher.email,
        displayName: community.teacher.displayName,
        role: "ADMIN",
        isOwner: true,
        joinedAt: null,
        progress: p.percent,
      };
    };

    const memberEntry = async (jr) => {
      const p = await getMemberProgress(jr.requester.id, communityRef);
      return {
        id: jr.requester.id,
        email: jr.requester.email,
        displayName: jr.requester.displayName,
        role: jr.role,
        isOwner: false,
        joinedAt: jr.reviewedAt ?? jr.createdAt,
        progress: p.percent,
      };
    };

    let members;
    if (canSeeAll) {
      members = [await ownerEntry()];
      for (const jr of approved) members.push(await memberEntry(jr));
    } else {
      // MEMBER: solo su propia fila. Si por algún motivo no aparece (caso raro),
      // se devuelve una lista vacía, nunca la de los demás.
      members = isOwner
        ? [await ownerEntry()]
        : myJoin
          ? [await memberEntry(myJoin)]
          : [];
    }

    return new Response(
      JSON.stringify({
        community: {
          id: community.id,
          name: community.name,
          profileTrack: community.profileTrack,
          stage: community.stage,
        },
        // El cliente ya no tiene que deducir su rol (ni puede falsearlo).
        viewerRole,
        members,
        memberCount,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
