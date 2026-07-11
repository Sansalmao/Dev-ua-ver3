import { prisma } from "./prisma.js";

/** Error con código HTTP incorporado. */
export class AuthError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

/**
 * getSession — fuente única de "quién es el usuario actual".
 * El middleware ya validó el token y llenó locals.user; esto solo lo lee.
 * Devuelve el usuario o null (nunca lanza).
 */
export function getSession(locals) {
  return locals?.user ?? null;
}

/** Exige que haya sesión. 401 si no. Devuelve el user. */
export function requireUser(user) {
  if (!user) throw new AuthError(401, "No autenticado.");
  return user;
}

/** Exige un profileType concreto ('PROFESOR' | 'ESTUDIANTE'). 401/403. */
export function requireRole(user, role) {
  requireUser(user);
  if (user.profileType !== role) {
    throw new AuthError(403, `Requiere perfil ${role}.`);
  }
  return user;
}

/** Exige admin de plataforma. 401/403. */
export function requireAdmin(user) {
  requireUser(user);
  if (!user.isAdmin) {
    throw new AuthError(403, "Requiere permisos de administrador.");
  }
  return user;
}

/**
 * Exige profesor VERIFICADO  (T2.8).
 * Combina requireRole('PROFESOR') + chequeo en base de teacherVerificationStatus.
 * Es async porque el estado de verificación no viaja en el token (puede cambiar).
 */
export async function requireVerifiedTeacher(user) {
  requireRole(user, "PROFESOR");

  const record = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { teacherVerificationStatus: true },
  });

  if (!record || record.teacherVerificationStatus !== "VERIFIED") {
    throw new AuthError(403, "Profesor no verificado.");
  }
  return user;
}

/** Convierte cualquier error en una Response JSON con el código adecuado. */
export function toErrorResponse(error) {
  const status = error instanceof AuthError ? error.status : 500;
  const message =
    error instanceof AuthError ? error.message : "Error interno del servidor.";

  if (status === 500) {
    // Log solo de errores inesperados; los 401/403 son flujo normal.
    console.error("[auth] Error no controlado:", error);
  }

  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
