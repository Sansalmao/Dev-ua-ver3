import { defineMiddleware } from "astro:middleware";
import { auth } from "./lib/auth-server.js";

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) {
    context.locals.user = null;
    return next();
  }

  const result = await auth.api.getSession({
    headers: context.request.headers,
  });

  context.locals.user = result?.user
    ? {
        userId: result.user.id,
        profileType: (result.user as Record<string, unknown>).profileType as
          | "PROFESOR"
          | "ESTUDIANTE",
        isAdmin: Boolean((result.user as Record<string, unknown>).isAdmin),
      }
    : null;

  return next();
});
