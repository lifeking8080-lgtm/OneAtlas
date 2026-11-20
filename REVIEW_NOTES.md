# OneAtlas — review and verification status

## What was inspected
- Extracted the supplied `OneAtlas_FullStack_Corrected.zip` into a clean directory.
- Confirmed the ZIP extracts successfully and contains the Next.js app, API route handlers, reusable components, Prisma schema, seed script, package manifest, lockfile, `.env.example`, and README.
- Confirmed malformed brace-named placeholder directories are not present in this prepared archive.
- Confirmed `node_modules` and real `.env` credentials are not included.
- Reviewed the Prisma models, database client, query helpers, seed script, API handlers, and primary page files at source level.

## Verification results
- ZIP extraction and archive integrity: PASS.
- Source-tree inspection: PASS.
- TypeScript compilation: NOT VERIFIED.
- Clean dependency installation (`npm ci`): NOT COMPLETED. The attempt exceeded the available execution time in this environment.
- Production build (`npm run build`): NOT RUN because dependencies could not be installed.
- Live Supabase connection: NOT TESTED; it requires a Supabase project and private connection strings supplied by the project owner.
- Browser/runtime testing: NOT COMPLETED.

Do not describe this project as fully tested or production-ready until the pending checks pass.

## Important data note
The seed script intentionally inserts illustrative sample model and pricing data. It does not seed benchmark scores. The UI/README label these as sample data. Replace or supplement them with sourced, dated data before presenting them as factual rankings or current prices.

## Next steps on your computer
1. Install Node.js 20 LTS or newer.
2. Extract this ZIP and open a terminal in the `oneatlas` folder.
3. Run `npm ci`.
4. Copy `.env.example` to `.env`; fill in your own Supabase PostgreSQL URLs. Never share or commit `.env`.
5. Run `npx prisma generate`.
6. Run `npm run db:push`, then `npm run db:seed`.
7. Run `npm run typecheck` and `npm run build`. Fix any errors before deployment.
8. Run `npm run dev` and test every page and API route in a browser.
9. Push the project to GitHub and deploy to Vercel only after the checks pass.

## Security reminders
- Keep database passwords private.
- Do not commit `.env`, service-role keys, or other secrets.
- Do not expose database credentials in client-side code.
