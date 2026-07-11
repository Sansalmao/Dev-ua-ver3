import bcrypt from "bcryptjs";
import { prisma } from "@lib/prisma.js";
import { signSession, SESSION_COOKIE } from "@lib/jwt.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request, cookies }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Body JSON inválido." }, 400);
  }

  const { email, password } = body ?? {};
  if (!email || !password) {
    return json({ error: "Email y contraseña son obligatorios." }, 400);
  }

  const user = await prisma.user.findUnique({
    where: { email: String(email).toLowerCase() },
  });

  // Mismo mensaje para "no existe" y "contraseña mala" (no filtrar qué falló).
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) {
    return json({ error: "Credenciales inválidas." }, 401);
  }

  const token = signSession({
    userId: user.id,
    profileType: user.profileType,
    isAdmin: user.isAdmin,
  });

  cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: import.meta.env.PROD, // https en producción
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  return json({
    token,
    user: {
      id: user.id,
      email: user.email,
      profileType: user.profileType,
      isAdmin: user.isAdmin,
    },
  });
}
