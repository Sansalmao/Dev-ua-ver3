import { SESSION_COOKIE } from "@lib/jwt.js";

export async function POST({ cookies }) {
  cookies.delete(SESSION_COOKIE, { path: "/" });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
