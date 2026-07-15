import { auth } from "@lib/auth-server.js";
import { prisma } from "@lib/prisma.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Body JSON inválido." }, 400);
  }

  const { email, newPassword } = body ?? {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return json({ error: "Email inválido." }, 400);
  }
  if (
    !newPassword ||
    typeof newPassword !== "string" ||
    newPassword.length < 8
  ) {
    return json(
      { error: "La contraseña debe tener al menos 8 caracteres." },
      400,
    );
  }

  const normalizedEmail = email.toLowerCase();

  try {
    // 1. Validar que la cuenta exista.
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });
    if (!user) {
      return json({ error: "No existe una cuenta con ese correo." }, 404);
    }

    // 2. Re-hashear con el MISMO algoritmo de Better Auth (vía su contexto).
    //    El hash de la credencial vive en Account(providerId="credential").
    const ctx = await auth.$context;
    const hashed = await ctx.password.hash(newPassword);

    const result = await prisma.account.updateMany({
      where: { userId: user.id, providerId: "credential" },
      data: { password: hashed },
    });

    if (result.count === 0) {
      return json(
        {
          error:
            "Esta cuenta no usa contraseña (se creó con otro método de acceso).",
        },
        400,
      );
    }

    // 3. Cerrar las sesiones activas: tras cambiar la clave hay que volver a
    //    entrar. Si el método interno cambia de nombre entre versiones, no es
    //    crítico para el reset en sí.
    try {
      await ctx.internalAdapter.deleteSessions(user.id);
    } catch (e) {
      console.warn("[auth/reset-password] No se pudieron cerrar sesiones:", e);
    }

    return json({ ok: true });
  } catch (error) {
    console.error("[auth/reset-password] Error inesperado:", error);
    return json({ error: "No se pudo cambiar la contraseña." }, 500);
  }
}
