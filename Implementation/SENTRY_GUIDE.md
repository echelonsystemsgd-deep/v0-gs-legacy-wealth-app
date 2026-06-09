# Sentry Setup Guide

> ✅ **Status: Complete** — Sentry is fully integrated into the GS Legacy Wealth app.

## What Was Set Up

| File | Purpose |
|---|---|
| `sentry.client.config.ts` | Initializes Sentry on the browser (client-side) |
| `sentry.server.config.ts` | Initializes Sentry on the Next.js server |
| `sentry.edge.config.ts` | Initializes Sentry on the Edge runtime (middleware) |
| `next.config.mjs` | Wrapped with `withSentryConfig` for source map uploads |
| `.env` | Contains `NEXT_PUBLIC_SENTRY_DSN` (gitignored) |

## Environment Variable

```env
# .env (gitignored — do not commit)
NEXT_PUBLIC_SENTRY_DSN=your_dsn_here
```

## Re-setup (if needed on a new machine)

Run the official wizard — it handles everything automatically:

```bash
npx @sentry/wizard@latest -i nextjs --saas --org gs-legacy-wealth --project gs-legacy-wealth
```

Then add your DSN to `.env`:
```env
NEXT_PUBLIC_SENTRY_DSN=https://<key>@<org>.ingest.de.sentry.io/<project-id>
```


## Useful Links

- [Sentry Dashboard](https://gs-legacy-wealth.sentry.io/)
- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
