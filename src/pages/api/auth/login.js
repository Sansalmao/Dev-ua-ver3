import { auth } from "@lib/auth-server.js";

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

  const { email, password } = body ?? {};
  if (!email || !password) {
    return json({ error: "Email y contraseña son obligatorios." }, 400);
  }

  try {
    const response = await auth.api.signInEmail({
      asResponse: true,
      body: { email: String(email).toLowerCase(), password },
    });

    if (!response.ok) {
      // No distinguimos "no existe" de "password incorrecta".
      return json({ error: "Credenciales inválidas." }, 401);
    }

    const data = await response.json();
    const user = data?.user ?? {};

    const headers = new Headers({ "Content-Type": "application/json" });
    for (const [key, value] of response.headers) {
      if (key.toLowerCase() === "set-cookie") headers.append("Set-Cookie", value);
    }

    return new Response(
      JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          profileType: user.profileType,
          isAdmin: user.isAdmin,
        },
      }),
      { status: 200, headers },
    );
  } catch (error) {
    console.error("[auth/login] Error inesperado:", error);
    return json({ error: "Error interno del servidor." }, 500);
  }
}
