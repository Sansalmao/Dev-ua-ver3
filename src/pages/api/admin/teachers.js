
import { prisma } from "@lib/prisma.js";
import { requireAdmin, toErrorResponse } from "../../../lib/auth.js";

export async function GET({ locals }) {
  try {
    requireAdmin(locals.user);

    const teachers = await prisma.user.findMany({
      where: {
        profileType: "PROFESOR",
        teacherVerificationStatus: "PENDING",
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return new Response(JSON.stringify({ teachers }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
