import { auth } from "@lib/auth-server.js";

export async function POST({ request }) {
  const response = await auth.api.signOut({
    asResponse: true,
    headers: request.headers,
  });

  const headers = new Headers({ "Content-Type": "application/json" });
  for (const [key, value] of response.headers) {
    if (key.toLowerCase() === "set-cookie") headers.append("Set-Cookie", value);
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
}
