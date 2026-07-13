// ============================================================================
//  Monta TODAS las rutas internas de Better Auth bajo /api/auth/*:
// ============================================================================

import type { APIRoute } from "astro";
import { auth } from "@lib/auth-server.js";

export const prerender = false;

export const ALL: APIRoute = async (ctx) => {
  return auth.handler(ctx.request);
};
