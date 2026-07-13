import * as Sentry from "@sentry/astro";

Sentry.init({
  // El DSN es público (identifica el proyecto, no da acceso).
  dsn: import.meta.env.SENTRY_DSN ?? "https://50cba2d79b822352bd802155a1da976c@o4509794217164800.ingest.us.sentry.io/4509794218737664",

  // Envía logs de la app a Sentry.
  enableLogs: true,

  // Envía PII por defecto (p. ej. IP del cliente)
  sendDefaultPii: true,
});
