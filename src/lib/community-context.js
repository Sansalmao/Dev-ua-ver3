import { prisma } from "./prisma.js";

/**
 * @param {string} userId
 * @returns {Promise<{ owned: Array, member: Array, all: Array }>}
 */
export async function getUserCommunityContext(userId) {
  // Comunidades propias (solo aplica a profesores, pero la consulta es general).
  const owned = await prisma.community.findMany({
    where: { teacherId: userId },
    orderBy: { createdAt: "desc" },
  });

  // Membresías aprobadas → comunidades a las que pertenece como miembro.
  const approved = await prisma.joinRequest.findMany({
    where: { requesterId: userId, status: "APPROVED" },
    include: { community: true },
    orderBy: { reviewedAt: "desc" },
  });
  const member = approved.map((jr) => jr.community);

  // Unión sin duplicados (por si acaso un id aparece en ambas).
  const seen = new Set(owned.map((c) => c.id));
  const all = [...owned, ...member.filter((c) => !seen.has(c.id))];

  return { owned, member, all };
}

/**
 * Atajo booleano para "¿el usuario pertenece a alguna comunidad?" (owned ∪ member).
 * Base de la corrección F-C2.
 */
export async function userHasAnyCommunity(userId) {
  const { all } = await getUserCommunityContext(userId);
  return all.length > 0;
}

/**
 * ¿El usuario es dueño de esta comunidad específica?
 * Útil para los chequeos de propiedad (T3.7, T3.8).
 */
export async function isCommunityOwner(userId, communityId) {
  const community = await prisma.community.findUnique({
    where: { id: communityId },
    select: { teacherId: true },
  });
  return Boolean(community) && community.teacherId === userId;
}
