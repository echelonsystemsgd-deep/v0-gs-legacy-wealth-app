export async function register() {
  try {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      await import("./sentry.server.config");
    }

    if (process.env.NEXT_RUNTIME === "edge") {
      await import("./sentry.edge.config");
    }
  } catch (e) {
    // Sentry unresolvable in local environment
  }
}

export function onRequestError() {
  // Graceful no-op when Sentry is absent
}
