import { defineConfig } from "astro/config";
import node from "@astrojs/node";

import sentry from "@sentry/astro";

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),

  security: {
    checkOrigin: false,
  },

  integrations: [sentry()],
});