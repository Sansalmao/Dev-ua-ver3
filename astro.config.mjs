// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";

// ─────────────────────────────────────────────────────────────────────────────
//  Proyecto BACKEND (Admin Console + Dashboard + API).  T1.1
//  output: 'server'  → cada ruta se renderiza en el servidor por defecto.
//  Si mudas páginas estáticas aquí, márcalas con `export const prerender = true`.
//
//  Tailwind (T1.2): se agrega con `npx astro add tailwind`, que en Astro 5+
//  cablea automáticamente el plugin de Vite. No hace falta tocar este archivo.
// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
});
