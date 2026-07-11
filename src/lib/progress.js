import { prisma } from "@lib/prisma.js";
import { unlockedStages } from "@lib/stages.js";

/**
 * Progreso (0–100) de un usuario dentro de una comunidad concreta.
 * @param {string} userId
 * @param {{ id: string, stage: string }} community
 * @returns {Promise<{ percent: number, completed: number, total: number }>}
 */
export async function getMemberProgress(userId, community) {
  const stages = unlockedStages(community.stage);

  // Retos accesibles de esa comunidad.
  const total = await prisma.challenge.count({
    where: { communityId: community.id, requiredStage: { in: stages } },
  });
  if (total === 0) return { percent: 0, completed: 0, total: 0 };

  // Retos de esa comunidad con una entrega APROBADA de este usuario.
  const completed = await prisma.submission.count({
    where: {
      authorId: userId,
      status: "APPROVED",
      challenge: { communityId: community.id, requiredStage: { in: stages } },
    },
  });

  const percent = Math.round((completed / total) * 100);
  return { percent, completed, total };
}
