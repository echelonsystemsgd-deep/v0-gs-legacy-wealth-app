# Sentry Setup Guide

## 1. Create a Sentry Account
- Go to [Sentry.io](https://sentry.io/signup/) and create an account.
- Choose **React** (or your specific framework like **Next.js** / **Vite**) as your platform.

## 2. Get Your DSN
- Once your project is created in Sentry, navigate to **Settings > Projects > [Your Project] > Client Keys (DSN)**.
- Copy the **DSN** URL.

## 3. Add to Environment Variables
- Add the DSN to your `.env` or `.env.local` file:
  ```env
  VITE_SENTRY_DSN=your_dsn_here
  # or NEXT_PUBLIC_SENTRY_DSN=your_dsn_here
  ```

## 4. Install the SDK
- Run the following command in your terminal:
  ```bash
  npm install @sentry/react @sentry/tracing
  # or npx @sentry/wizard@latest -i nextjs
  ```

## 5. Initialize Sentry
- Add the initialization code as early as possible in your application's lifecycle (e.g., `main.tsx`, `index.tsx`, or `app.tsx`).

For detailed documentation, visit the [Sentry Docs](https://docs.sentry.io/).
