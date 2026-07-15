import { prisma } from "@lib/prisma.js";
import { requireUser, toErrorResponse } from "@lib/auth.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET({ locals }) {
  try {
    const user = requireUser(locals.user);

    const rows = await prisma.topicProgress.findMany({
      where: { userId: user.userId },
      select: { topicId: true, visitado: true, completado: true },
    });

    const progress = {};
    for (const row of rows) {
      progress[row.topicId] = {
        visitado: row.visitado,
        completado: row.completado,
      };
    }

    return json({ progress });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PUT({ locals, request }) {
  try {
    const user = requireUser(locals.user);

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Body JSON inválido." }, 400);
    }

    const { topicId, visitado, completado } = body ?? {};
    if (!topicId || typeof topicId !== "string") {
      return json({ error: "topicId es obligatorio." }, 400);
    }

    const row = await prisma.topicProgress.upsert({
      where: { userId_topicId: { userId: user.userId, topicId } },
      update: {
        visitado: Boolean(visitado),
        completado: Boolean(completado),
      },
      create: {
        userId: user.userId,
        topicId,
        visitado: Boolean(visitado),
        completado: Boolean(completado),
      },
      select: { topicId: true, visitado: true, completado: true },
    });

    return json({ progress: row });
  } catch (error) {
    return toErrorResponse(error);
  }
}
