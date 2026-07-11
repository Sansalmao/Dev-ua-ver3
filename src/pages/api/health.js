import { prisma } from "../../lib/prisma.js";

export async function GET() {
  try {
    // Consulta trivial: si la conexión falla, saltará al catch.
    await prisma.$queryRaw`SELECT 1`;

    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "error", detail: String(error) }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }
}
