import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import sentry from "@sentry/astro";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({

  output: "server",
  adapter: node({ mode: "standalone" }),

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
