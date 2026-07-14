import { auth } from "@lib/auth-server.js";
import { verifyTurnstileToken, getClientIp } from "@lib/turnstile.js";

const PROFILE_TYPES = ["PROFESOR", "ESTUDIANTE"];

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

  const { email, password, profileType, displayName, turnstileToken, country, institution, wantsCommunity } =
    body ?? {};

  // ── Validación ────
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return json({ error: "Email inválido." }, 400);
  }
  if (!password || typeof password !== "string" || password.length < 8) {
    return json({ error: "La contraseña debe tener al menos 8 caracteres." }, 400);
  }
  if (!PROFILE_TYPES.includes(profileType)) {
    return json({ error: "profileType debe ser PROFESOR o ESTUDIANTE." }, 400);
  }

  // ── Turnstile ──────────────────────────────────────────
  const { success: humanVerified, errors: turnstileErrors } = await verifyTurnstileToken(
    turnstileToken,
    getClientIp(request),
  );
  if (!humanVerified) {
    console.warn("[auth/register] Turnstile rechazado:", turnstileErrors);
    return json({ error: "Verificación anti-bot fallida. Intenta de nuevo." }, 400);
  }

  // Los campos extra de Profesor solo se guardan si profileType es
  // PROFESOR — para ESTUDIANTE se ignora cualquier cosa que venga en el
  // body (nunca se confía en que el cliente mande combinaciones raras).
  const profesorExtra =
    profileType === "PROFESOR"
      ? {
          country: typeof country === "string" ? country.trim().slice(0, 100) || undefined : undefined,
          institution:
            typeof institution === "string" ? institution.trim().slice(0, 150) || undefined : undefined,
          wantsCommunity: Boolean(wantsCommunity),
        }
      : {};

  try {
    const response = await auth.api.signUpEmail({
      asResponse: true,
      body: {
        email: String(email).toLowerCase(),
        password,
        name: displayName ?? String(email).split("@")[0],
        profileType,
        ...profesorExtra,
      },
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const status = response.status === 422 ? 409 : response.status;
      const message =
        errBody?.code === "USER_ALREADY_EXISTS"
          ? "Ya existe una cuenta con ese email."
          : errBody?.message ?? "No se pudo completar el registro.";
      return json({ error: message }, status);
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
          teacherVerificationStatus: user.teacherVerificationStatus,
        },
      }),
      { status: 201, headers },
    );
  } catch (error) {
    console.error("[auth/register] Error inesperado:", error);
    return json({ error: "Error interno del servidor." }, 500);
  }
}
