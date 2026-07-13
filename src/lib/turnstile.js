const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const SECRET = process.env.TURNSTILE_SECRET_KEY;

/**
 * @param {string} token   El valor de `cf-turnstile-response` que manda el widget.
 * @param {string} [remoteip]  IP del cliente (opcional, mejora la precisión de Cloudflare).
 * @returns {Promise<{ success: boolean, errors: string[] }>}
 */
export async function verifyTurnstileToken(token, remoteip) {
  if (!SECRET) {
    throw new Error(
      "[turnstile] Falta TURNSTILE_SECRET_KEY en el .env. " +
        "Sacala de https://dash.cloudflare.com/?to=/:account/turnstile " +
        "(para dev local podés usar la secret de prueba: " +
        "1x0000000000000000000000000000000AA).",
    );
  }

  if (!token || typeof token !== "string") {
    return { success: false, errors: ["missing-input-response"] };
  }

  const body = new URLSearchParams({ secret: SECRET, response: token });
  if (remoteip) body.set("remoteip", remoteip);

  let data;
  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    data = await res.json();
  } catch (error) {
    console.error("[turnstile] No se pudo contactar a Cloudflare:", error);
    return { success: false, errors: ["internal-error"] };
  }

  return {
    success: Boolean(data?.success),
    errors: Array.isArray(data?.["error-codes"]) ? data["error-codes"] : [],
  };
}

/** Mejor esfuerzo para sacar la IP real del cliente detrás de un proxy/CDN. */
export function getClientIp(request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("cf-connecting-ip") ?? undefined;
}
