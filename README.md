# OneAtlas — AI Model Intelligence Platform
Next.js 14 · React · TypeScript · Tailwind · Prisma · Supabase PostgreSQL · Zod

> **Data notice:** all models, prices, dates and context windows come from `prisma/seed.ts` and are **demo data, not verified** (flagged `isSample` in the DB and in the UI). **No benchmark scores are seeded**; the Rankings page stays empty until you add sourced `BenchmarkResult` rows.

## Setup
1. Extract the ZIP and `cd oneatlas`.
2. Use Node.js 20 LTS or newer, then run `npm ci` (uses the committed lockfile and runs `prisma generate`).
3. Create a project at supabase.com. Open *Project Settings → Database → Connection string*.
4. `cp .env.example .env` and set `DATABASE_URL` (pooled, port 6543, `?pgbouncer=true`) and `DIRECT_URL` (port 5432).
5. If Prisma Client generation did not run during install, run `npx prisma generate`.
6. `npm run db:push` (creates tables)
7. `npm run db:seed` (loads demo data)
8. `npm run dev` → http://localhost:3000

## Scripts
`dev`, `build`, `start`, `typecheck`, `db:push`, `db:seed`

## API
`GET /api/models?q&company&provider&capability&category&sort&page&pageSize` · `/api/models/:slug` · `/api/search?q=` · `/api/providers` · `/api/companies` · `/api/benchmarks` · `/api/rankings?benchmark&category` · `/api/compare?slugs=a,b`
Inputs are validated with Zod (400 on bad input, 404 when missing, 500 with a generic message).

## GitHub
`git init && git add . && git commit -m "OneAtlas" && git branch -M main && git remote add origin <repo-url> && git push -u origin main` (`.env` is git-ignored).

## Vercel
Import the repo, add `DATABASE_URL` and `DIRECT_URL` in Environment Variables, deploy. Build command is `npm run build` (default).

## Adding real data
Insert rows into `Benchmark`/`BenchmarkResult` (with `source`, `sourceUrl`) and set `isSample=false` on verified models and prices.
