export const STAGE_ORDER = ["CONCEPTOS_CLAVE", "IMPLEMENTACION_TECNICA"];

/**
 * ¿Una comunidad en `communityStage` da acceso a un reto que requiere `requiredStage`?
 * true si requiredStage está en la etapa de la comunidad o por debajo.
 */
export function stageAllows(communityStage, requiredStage) {
  const cur = STAGE_ORDER.indexOf(communityStage);
  const req = STAGE_ORDER.indexOf(requiredStage);
  if (cur === -1 || req === -1) return false;
  return req <= cur;
}

/** Lista de etapas desbloqueadas por una comunidad (para filtrar en la query). */
export function unlockedStages(communityStage) {
  const cur = STAGE_ORDER.indexOf(communityStage);
  if (cur === -1) return [];
  return STAGE_ORDER.slice(0, cur + 1);
}
