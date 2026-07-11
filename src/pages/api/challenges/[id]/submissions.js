import { prisma } from "@lib/prisma.js";
import {
  requireUser,
  AuthError,
  toErrorResponse,
} from "@lib/auth.js";
import { getUserCommunityContext, isCommunityOwner } from "@lib/community-context.js";
import { stageAllows } from "@lib/stages.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function loadChallengeOr404(challengeId) {
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: {
      id: true,
      requiredStage: true,
      community: { select: { id: true, stage: true, teacherId: true } },
    },
  });
  if (!challenge) throw new AuthError(404, "Reto no encontrado.");
  return challenge;
}

// ── POST — enviar solución ────────────────────────────────────────────────────
export async function POST({ params, request, locals }) {
  try {
    const user = requireUser(locals.user);
    const challenge = await loadChallengeOr404(params.id);

    // Pertenencia a la comunidad del reto.
    const { all } = await getUserCommunityContext(user.userId);
    const belongs = all.some((c) => c.id === challenge.community.id);
    if (!belongs) throw new AuthError(403, "No perteneces a la comunidad de este reto.");

    // Etapa desbloqueada.
    if (!stageAllows(challenge.community.stage, challenge.requiredStage)) {
      throw new AuthError(403, "Este reto pertenece a una etapa aún no desbloqueada.");
    }

    let body;
    try {
      body = await request.json();
    } catch {
      throw new AuthError(400, "Body JSON inválido.");
    }

    const { repoUrl, language } = body ?? {};
    if (!repoUrl || typeof repoUrl !== "string" || !/^https?:\/\//.test(repoUrl)) {
      throw new AuthError(400, "repoUrl debe ser una URL válida (http/https).");
    }

    // Upsert: una entrega por (reto, autor). Re-entregar la deja PENDING de nuevo.
    const submission = await prisma.submission.upsert({
      where: {
        challengeId_authorId: { challengeId: challenge.id, authorId: user.userId },
      },
      create: {
        challengeId: challenge.id,
        authorId: user.userId,
        repoUrl: repoUrl.trim(),
        language: language ?? null,
        status: "PENDING",
      },
      update: {
        repoUrl: repoUrl.trim(),
        language: language ?? null,
        status: "PENDING",
        rating: null,
        rejectReason: null,
        reviewedById: null,
        reviewedAt: null,
      },
      select: {
        id: true,
        challengeId: true,
        status: true,
        repoUrl: true,
        language: true,
        createdAt: true,
      },
    });

    return json({ submission }, 201);
  } catch (error) {
    return toErrorResponse(error);
  }
}

// ── GET — listar entregas del reto ────────────────────────────────────────────
export async function GET({ params, locals }) {
  try {
    const user = requireUser(locals.user);
    const challenge = await loadChallengeOr404(params.id);

    const owner = await isCommunityOwner(user.userId, challenge.community.id);

    // El dueño ve todas; un miembro solo las suyas.
    const where = { challengeId: challenge.id };
    if (!owner) {
      // Debe al menos pertenecer a la comunidad.
      const { all } = await getUserCommunityContext(user.userId);
      const belongs = all.some((c) => c.id === challenge.community.id);
      if (!belongs) throw new AuthError(403, "No perteneces a la comunidad de este reto.");
      where.authorId = user.userId;
    }

    const submissions = await prisma.submission.findMany({
      where,
      select: {
        id: true,
        status: true,
        repoUrl: true,
        language: true,
        rating: true,
        rejectReason: true,
        createdAt: true,
        reviewedAt: true,
        author: { select: { id: true, displayName: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return json({ submissions });
  } catch (error) {
    return toErrorResponse(error);
  }
}
