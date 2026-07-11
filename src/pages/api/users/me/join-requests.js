import { prisma } from "@lib/prisma.js";
import { requireUser, toErrorResponse } from "@lib/auth.js";

export async function GET({ locals }) {
  try {
    const user = requireUser(locals.user);

    const requests = await prisma.joinRequest.findMany({
      where: { requesterId: user.userId },
      select: {
        id: true,
        status: true,
        rejectReason: true,
        createdAt: true,
        reviewedAt: true,
        community: {
          select: {
            id: true,
            name: true,
            profileTrack: true,
            stage: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return new Response(JSON.stringify({ requests }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
