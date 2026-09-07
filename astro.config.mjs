import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import sentry from "@sentry/astro";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  security: {
    checkOrigin: false,
  },
  integrations: [
    react(),
    mdx(),
    sentry({
      sourceMapsUploadOptions: {
        project: "javascript-astro",
        authToken: process.env.SENTRY_AUTH_TOKEN,
        telemetry: false,
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
