# Spacy

Space booking client. The screens match the Next.js app, rewritten as a Vite SPA with React Router in Data Mode and wired to the live Spacey API.

## Setup

```bash
bun install
bun run dev
```

The app runs at `http://localhost:5173`.

`VITE_API_BASE_URL` is the API origin (`https://spacey.cs403bkk26.space`). During development, requests go to `/api` and Vite proxies them to that origin so the HttpOnly session cookie stays first-party. The API does not send CORS headers.

## Scripts

- `bun run dev` — Vite dev server
- `bun run typecheck` — TypeScript
- `bun run build` — typecheck and production build
- `bun run preview` — preview the production build
