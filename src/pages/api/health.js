import { prisma } from "@lib/prisma.js";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return new Response(JSON.stringify({ status: "ok", db: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "degraded", db: "error", message: String(err?.message ?? err) }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }
}
