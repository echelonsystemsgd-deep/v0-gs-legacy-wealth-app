try {
  const Sentry = await import("@sentry/nextjs");
  if (Sentry && Sentry.init) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
      tracesSampleRate: 1,
      debug: false,
    });
  }
} catch (e) {
  // Sentry fallback
}
