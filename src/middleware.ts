import { defineMiddleware } from "astro:middleware";
import { verifySession, SESSION_COOKIE } from "./lib/jwt.js";

export const onRequest = defineMiddleware(async (context, next) => {
  // 1) Cookie httpOnly
  let token = context.cookies.get(SESSION_COOKIE)?.value;

  // 2) Fallback: header Authorization
  if (!token) {
    const auth = context.request.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) {
      token = auth.slice("Bearer ".length).trim();
    }
  }

  // 3) Verificar y poblar locals
  const payload = token ? verifySession(token) : null;

  context.locals.user =
    payload && typeof payload === "object"
      ? {
          userId: payload.userId,
          profileType: payload.profileType,
          isAdmin: Boolean(payload.isAdmin),
        }
      : null;

  return next();
});
