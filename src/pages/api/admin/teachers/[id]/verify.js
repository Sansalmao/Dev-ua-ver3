import { prisma } from "@lib/prisma.js";
import {
  requireAdmin,
  AuthError,
  toErrorResponse,
} from "@lib/auth.js";

const ACTION_TO_STATUS = {
  APPROVE: "VERIFIED",
  REJECT: "REJECTED",
};

export async function PATCH({ params, request, locals }) {
  try {
    requireAdmin(locals.user);

    const { id } = params;

    let body;
    try {
      body = await request.json();
    } catch {
      throw new AuthError(400, "Body JSON inválido.");
    }

    const status = ACTION_TO_STATUS[body?.action];
    if (!status) {
      throw new AuthError(400, "action debe ser APPROVE o REJECT.");
    }

    // Verificar que exista y sea profesor antes de tocarlo.
    const target = await prisma.user.findUnique({
      where: { id },
      select: { id: true, profileType: true },
    });
    if (!target || target.profileType !== "PROFESOR") {
      throw new AuthError(404, "Profesor no encontrado.");
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { teacherVerificationStatus: status },
      select: {
        id: true,
        email: true,
        displayName: true,
        teacherVerificationStatus: true,
      },
    });

    return new Response(JSON.stringify({ teacher: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
