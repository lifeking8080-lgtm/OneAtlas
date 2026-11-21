# OneAtlas — Free AI Research Assistant (Groq + LangSearch)

Adds a research tool to the existing **Admin Dashboard** (`/admin`). Nothing else in the site, Prisma schema, auth or deployment config was changed.

## How it works
1. Super Admin enters an AI model name.
2. **LangSearch** runs four focused web searches (details, pricing, benchmarks, providers).
3. **Groq** (`openai/gpt-oss-120b`) extracts structured data from those results only.
4. An **editable preview** shows four groups: AI Model, Providers, Pricing, Benchmarks (plus "unknown" notes and all search sources).
5. Nothing is written until you click **Approve & save to database**. Then it is saved to Supabase PostgreSQL through the existing Prisma schema.

## No-fabrication safeguards
- The model is instructed to use only the supplied search results and to output `null` for anything not stated.
- Server-side check: every price, benchmark score and model fact must cite a URL that was actually returned by the search. Values whose source is missing/invented are cleared and listed under "Unknown".
- Empty fields in the preview mean **unknown** and are stored as unknown (null / "Unknown"). Nothing is auto-filled.
- Saved rows are marked `isSample = false` and keep their source URLs.

## Environment variables (server-side only)
Add in **Render → Environment** (and a local `.env`). Never commit real values.

| Variable | Value |
|---|---|
| `GROQ_API_KEY` | from https://console.groq.com/keys (free tier) |
| `GROQ_MODEL` | `openai/gpt-oss-120b` |
| `LANGSEARCH_API_KEY` | from https://langsearch.com (free tier) |
| `AI_PROVIDER` | optional, defaults to `groq` |

Existing variables (`DATABASE_URL`, `DIRECT_URL`, `PORT`, Supabase/admin variables) are unchanged. Free tiers are rate limited; the UI shows a clear message if a limit is hit.

## Deploy
1. Upload the updated files to the same GitHub repo.
2. In Render, add the three variables above. Keep Build `npm run build` and Start `npm start`.
3. No database migration is needed (schema unchanged).
4. Open `/admin/login`, sign in as Super Admin, and use **AI Research Assistant**.

## Saving rules (because of the existing schema)
- A **company name** is required (every model links to a company). Existing companies/providers/benchmarks are reused by slug, never overwritten.
- A pricing row is saved only if **both** input and output prices are known and the currency is USD.
- A benchmark is saved only if the score is known and a source URL exists.
- If the model slug already exists you get a conflict message and can choose **Update existing model & save**.

## Switching to a paid AI model later
AI calls go through the `AIProvider` interface in `lib/ai/`. To switch: add `lib/ai/<provider>.ts` implementing `generateJson`, register it in `lib/ai/index.ts`, and set `AI_PROVIDER`. Routes and UI don't change. Search is isolated in `lib/search/langsearch.ts`.

## Files added
`lib/ai/*`, `lib/search/langsearch.ts`, `lib/research/{schema,extract,save}.ts`, `app/api/admin/ai-research/route.ts`, `app/api/admin/ai-research/approve/route.ts`, `components/admin/ResearchAssistant.tsx`, `.gitignore`.
Modified: `app/admin/page.tsx` (Research Assistant panel), `.env.example`, `ADMIN_SETUP.md`, `README.md`.
