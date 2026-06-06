# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## ⚠️ Next.js version warning (from AGENTS.md)

This repo runs **Next.js 16.2.6 + React 19.2** — newer than most training data. APIs, conventions, and file structure may differ from what you remember. Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` and heed deprecation notices. Notable in this codebase: dynamic route `params` is a `Promise` and must be unwrapped with React's `use()` (see `src/app/pdf/[slug]/page.tsx`).

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build (also runs Prisma codegen via dependencies)
npm start        # Serve the production build
npm run lint     # ESLint (flat config, eslint-config-next core-web-vitals + typescript)
```

There is **no test suite, no test runner, and no typecheck script** — `npm run lint` and `npm run build` are the only verification gates. Run both before considering a change done.

Prisma (SQLite):
```bash
npx prisma generate          # Regenerate client after editing prisma/schema.prisma
npx prisma db push           # Apply schema to the SQLite db (no migration files are used)
npx prisma studio            # Inspect the database
```
`DATABASE_URL` must point at the SQLite file (e.g. `file:./prisma/prisma/dev.db`). The committed `dev.db` / `prisma/prisma/dev.db` are local dev databases; production uses its own file on the VPS.

## Architecture

This is **BestAIFinds** — a TinyWow-style suite of ~90 free online utilities (PDF, image, video, file, and AI writing tools), plus auth, subscription billing, a blog, and an AI "Content Machine". App Router only; everything lives under `src/`.

### The tool registry is the source of truth

`src/lib/tools.ts` defines every tool as a `Tool` object (`slug`, `name`, `category`, `icon`, `featured`, and a `processing` tier). The five categories are `pdf | image | write | video | file`. **Adding or changing a tool starts here** — pages, navigation, related-tool lists, and the homepage all derive from `TOOLS` via helpers (`getToolsByCategory`, `getFeaturedTools`, `getToolBySlug`).

Each category has a single dynamic route that switches on slug, rather than one file per tool:
- `src/app/<category>/page.tsx` — category landing/grid
- `src/app/<category>/[slug]/page.tsx` — the actual tool, a client component that `switch`es on `tool.slug` to pick the operation
- Tool pages render inside `src/components/ToolLayout.tsx`, which adds breadcrumbs, related tools, and an SEO guide block pulled from `src/lib/tool-guides.ts` (per-slug steps, FAQs, and SEO copy).

So a new tool typically means: add an entry to `tools.ts`, add a `case` in the relevant `[slug]/page.tsx`, add the processing logic to the matching `src/lib/*-tools.ts` helper, and optionally a guide in `tool-guides.ts`.

### The `processing` tier determines where work happens

Every tool declares one of three tiers, and this dictates the implementation path:
- **`browser`** — runs entirely client-side, no network. PDF ops use `pdf-lib` / `pdfjs-dist` (`src/lib/pdf-tools.ts`), images use canvas (`src/lib/image-tools.ts`), file conversions use `xlsx` / `qrcode` (`src/lib/file-tools.ts`). Privacy ("files never leave your device") is a selling point baked into the guide copy.
- **`api`** — calls an internal API route that proxies **OpenAI** (`gpt-4o-mini` for text, image model for generation). Writing tools hit `src/app/api/ai/generate/route.ts`, which maps `tool` slug → system prompt; image generation hits `src/app/api/ai/image/route.ts`; PDF translate/summarize hit `src/app/api/pdf/process/route.ts`.
- **`server`** — needs binaries on the host: `src/app/api/video/process/route.ts` shells out to **FFmpeg**, and document conversions (PDF↔Word, Excel→PDF) use **LibreOffice headless**. These write to `/tmp/baf-*` and clean up after themselves. They are unavailable in environments without those binaries installed (see `deploy/setup.sh`).

### API route conventions

API routes live under `src/app/api/**/route.ts`. Public tool routes apply IP-based rate limiting via `src/lib/rate-limit.ts` (an in-memory `Map`, per-route limits in `RATE_LIMITS`) — there is no Redis, so limits reset on restart and are per-process. Routes degrade gracefully when keys are missing (e.g. AI routes return a friendly message instead of erroring when `OPENAI_API_KEY` is unset). There is also a **client-side daily usage cap** in `src/lib/usage-limit.ts` backed by `localStorage` (`DAILY_LIMITS` per tool tier) — this is a soft UX gate for free users, distinct from server rate limiting.

### Auth, users, and plans

NextAuth v5 (beta) is configured in `src/lib/auth.ts`: Google OAuth (only enabled when `GOOGLE_CLIENT_ID` is set) plus a Credentials provider with bcrypt password hashing. Sessions are **JWT-strategy** (not database sessions), with a `jwt` callback that re-reads the user's `plan` from the DB on every token refresh and exposes `session.user.plan`. Registration is handled by `src/app/api/auth/register/route.ts`. The Prisma schema (`prisma/schema.prisma`) has `User`/`Account`/`Session`; `User.plan` is `free | pro | business`. `src/middleware.ts` is currently a near-passthrough scoped only to `/api/stripe/checkout`.

### Payments — three parallel providers

Billing supports **three** payment paths, each with its own lib + checkout route + webhook:
- LemonSqueezy — `src/lib/lemonsqueezy.ts`, `src/app/api/lemonsqueezy/{checkout,webhook}/route.ts` (the primary/most recent path)
- Stripe — `src/lib/stripe.ts`, `src/app/api/stripe/{checkout,webhook}/route.ts`
- PayPal — `src/lib/paypal.ts`, `src/app/api/paypal/{checkout,webhook}/route.ts` (direct subscription plans)

Plus crypto wallet addresses shown on the pricing page. Webhooks update `User.plan`. Each provider's plan/variant/price IDs come from env vars (see below); the pricing UI is `src/app/pricing/page.tsx`.

### Content & blog

The blog is **file-based, not a CMS**: posts are hardcoded objects in `src/lib/blog.ts` (`BLOG_POSTS`), rendered by `src/app/blog/[slug]/page.tsx`. `scripts/auto-publish.sh` is a cron-style script run on the production VPS that fetches Google News RSS, asks OpenAI for SEO topics/articles, **inserts new entries directly into `src/lib/blog.ts`**, rebuilds, and restarts PM2. If `blog.ts` shows machine-generated entries you didn't write, that script is why — preserve its append point (the `];` line it targets). The "Content Machine" (`src/app/content-machine/**`, `src/app/api/content-machine/route.ts`) is the signed-in, interactive article generator (requires a session).

## Conventions

- **Path alias:** `@/*` → `src/*` (tsconfig). Use it for all internal imports.
- **UI:** Tailwind CSS v4 (config-less, via `@tailwindcss/postcss`; theme/tokens in `src/app/globals.css`) + shadcn (`components.json`, style `base-nova`, primitives under `src/components/ui/`, icons from `lucide-react`). Dark mode is class-based; `src/components/ThemeToggle.tsx` toggles it.
- **Prisma client** is a singleton in `src/lib/prisma.ts` (cached on `globalThis` outside production) — always import `prisma` from there, never `new PrismaClient()`.
- `src/lib/utils.ts` exports `cn()` (clsx + tailwind-merge), the standard className helper for shadcn components.

## Environment variables

Beyond `.env.example` (`OPENAI_API_KEY`, optional `REMOVEBG_API_KEY` / `PEXELS_API_KEY`), the code also reads (all optional — features self-disable when unset): `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`; Stripe `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `STRIPE_*_PRICE_ID`; LemonSqueezy `LEMONSQUEEZY_API_KEY` / `LEMONSQUEEZY_STORE_ID` / `LEMONSQUEEZY_WEBHOOK_SECRET` / `LS_*_VARIANT_ID`; PayPal `PAYPAL_MODE` / `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` / `PAYPAL_WEBHOOK_ID` / `PAYPAL_*_PLAN_ID`; and public `NEXT_PUBLIC_CRYPTO_USDT_TRC20` / `NEXT_PUBLIC_CRYPTO_USDC_ERC20`.

## Deployment

Self-hosted on a VPS (not Vercel) behind nginx + PM2. `deploy/setup.sh` provisions Node 20, PM2, **FFmpeg**, and **LibreOffice** (required by the `server`-tier tools). `deploy/deploy.sh` rsyncs the repo to the VPS, runs `npm install --production && npm run build`, and restarts via PM2 (`ecosystem.config.js`, app name `bestaifinds`, port 3000). `next.config.ts` sets security headers and long-lived caching for static assets.
