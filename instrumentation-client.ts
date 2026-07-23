// Safe Sentry client initialization fallback
try {
  const Sentry = await import("@sentry/nextjs");
  if (Sentry && Sentry.init) {
    Sentry.init({
      dsn: "https://1af752adb5cab09abd6e4e3e46ca1fc4@o4511535007006720.ingest.de.sentry.io/4511535020703825",
      tracesSampleRate: 1,
    });
  }
} catch (e) {
  // Sentry not present
}

export const onRouterTransitionStart = undefined;
