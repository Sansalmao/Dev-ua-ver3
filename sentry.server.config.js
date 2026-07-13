import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? "https://50cba2d79b822352bd802155a1da976c@o4509794217164800.ingest.us.sentry.io/4509794218737664",
  enableLogs: true,
  sendDefaultPii: true,
});
