import { prisma } from "@lib/prisma.js";
import { requireUser, toErrorResponse } from "@lib/auth.js";

export async function GET({ locals }) {
  try {
    const user = requireUser(locals.user);

    const submissions = await prisma.submission.findMany({
      where: { authorId: user.userId },
      select: {
        id: true,
        status: true,
        repoUrl: true,
        language: true,
        rating: true,
        rejectReason: true,
        createdAt: true,
        reviewedAt: true,
        challenge: {
          select: {
            id: true,
            title: true,
            requiredStage: true,
            community: { select: { id: true, name: true } },
          },
        },
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
