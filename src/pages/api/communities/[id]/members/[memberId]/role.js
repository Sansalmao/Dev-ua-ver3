import { prisma } from "@lib/prisma.js";
import { requireUser, AuthError, toErrorResponse } from "@lib/auth.js";

// El ADMIN de una comunidad es siempre el profesor dueño por eso
// este endpoint solo cicla entre MEMBER y MANAGER. Nunca se puede "ascender"
// a alguien a ADMIN por acá, ni tocar el rol del propio dueño.
const NEXT_ROLE = { MEMBER: "MANAGER", MANAGER: "MEMBER" };

export async function PATCH({ params, locals }) {
  try {
    const user = requireUser(locals.user);
    const { id: communityId, memberId } = params;

    const community = await prisma.community.findUnique({
      where: { id: communityId },
      select: { id: true, teacherId: true },
    });
    if (!community) throw new AuthError(404, "Comunidad no encontrada.");

    if (memberId === community.teacherId) {
      throw new AuthError(400, "El dueño de la comunidad no tiene un rol asignable: siempre es administrador.");
    }

    const targetJoin = await prisma.joinRequest.findFirst({
      where: { communityId, requesterId: memberId, status: "APPROVED" },
      select: { id: true, role: true },
    });
    if (!targetJoin) {
      throw new AuthError(404, "Ese usuario no es miembro aprobado de esta comunidad.");
    }

    // ── Autorización (mismo criterio que members.js) ──
    const isOwner = community.teacherId === user.userId;

    if (!isOwner) {
      const viewerJoin = await prisma.joinRequest.findFirst({
        where: { communityId, requesterId: user.userId, status: "APPROVED" },
        select: { role: true },
      });
      const viewerRole = viewerJoin?.role ?? "MEMBER";

      if (viewerRole !== "MANAGER") {
        throw new AuthError(403, "No tenés permiso para cambiar roles en esta comunidad.");
      }
      if (targetJoin.role !== "MEMBER") {
        throw new AuthError(403, "Un manager no puede cambiar el rol de otro manager.");
      }
    }

    const nextRole = NEXT_ROLE[targetJoin.role] ?? "MEMBER";

    const updated = await prisma.joinRequest.update({
      where: { id: targetJoin.id },
      data: { role: nextRole },
      select: {
        role: true,
        requester: { select: { id: true, email: true, displayName: true } },
      },
    });

    return new Response(
      JSON.stringify({ memberId: updated.requester.id, role: updated.role }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
