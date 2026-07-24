import * as Sentry from "@sentry/nextjs";

if (Sentry && typeof Sentry.init === "function") {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
    tracesSampleRate: 1,
    debug: false,
  });
}

export {};
