import { prisma } from "@lib/prisma.js";
import { unlockedStages } from "@lib/stages.js";
import { RUTAS } from "@lib/rutas";

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


/**
 * Progreso (0–100) de un usuario en el currículum de módulos (Ruta A básica),
 * completamente aparte del progreso por retos de `getMemberProgress`.
 * La ruta aplicable depende del rol de la cuenta, no de la comunidad: un
 * PROFESOR sigue `educator_basica`, un ESTUDIANTE sigue `learner_basica`
 * (mismo mapeo que usa ProfileModal.astro en el cliente).
 * @param {string} userId
 * @param {"PROFESOR" | "ESTUDIANTE"} profileType
 * @returns {Promise<{ percent: number, completed: number, total: number }>}
 */
export async function getModuleProgress(userId, profileType) {
  const rutaKey = profileType === "PROFESOR" ? "educator_basica" : "learner_basica";
  const temas = RUTAS[rutaKey]?.temas ?? [];
  const total = temas.length;
  if (total === 0) return { percent: 0, completed: 0, total: 0 };

  const topicIds = temas.map((t) => t.id);
  const completed = await prisma.topicProgress.count({
    where: { userId, topicId: { in: topicIds }, completado: true },
  });

  const percent = Math.round((completed / total) * 100);
  return { percent, completed, total };
}
