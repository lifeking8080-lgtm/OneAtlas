# OneAtlas Admin + AI Research Assistant

## Included in this ZIP
- Existing public OneAtlas website and Prisma schema retained unchanged.
- Admin entry point in the top navigation (`A` icon) at `/admin/login`.
- Supabase Auth password login. The server verifies the signed-in Supabase user against `SUPER_ADMIN_USER_ID` on every admin API request. Only that exact user can enter.
- AI Research Assistant (Groq + LangSearch): researches a model, shows an editable preview, and saves to the database only after Super Admin approval. See `AI_RESEARCH_SETUP.md`.

## Important scope note
The admin area provides secure Super Admin login and the AI Research Assistant. General model/provider/pricing/benchmark CRUD screens, inviting additional admins, approval queues, role management, ownership transfer, and audit logs are not implemented yet. Do not advertise those controls as available.

## 1. Configure Supabase
1. Open the Supabase project used by this app.
2. Authentication -> Users: confirm your own user exists and email is confirmed.
3. Copy that user's UUID (not the email).
4. Project Settings -> API: copy Project URL and the anon/publishable key. Never use the `service_role` key in the browser.
5. Keep email/password sign-in enabled. For the first owner account, use the email and password you created in Supabase Auth.

## 2. Configure Render Environment
Keep existing `DATABASE_URL`, `DIRECT_URL`, and `PORT` values unchanged.
Add:
- `NEXT_PUBLIC_SUPABASE_URL` = Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Supabase anon/publishable key
- `SUPER_ADMIN_USER_ID` = your Supabase Auth user UUID
- `GROQ_API_KEY` = key from https://console.groq.com/keys (free tier available)
- `GROQ_MODEL` = `openai/gpt-oss-120b`
- `LANGSEARCH_API_KEY` = key from https://langsearch.com (free tier available)

Do not paste secrets into GitHub, source files, chat, or `.env.example`. Add real values only in Render Environment. Free tiers are rate limited; check each provider's current limits.

## 3. Deploy
1. Extract this ZIP and review the diff against your current GitHub repository.
2. Upload/commit the files to the same GitHub repository. Do not delete existing public website files.
3. Render should deploy from the updated repository. Keep Build Command as `npm run build` and Start Command as `npm start` (or the existing working equivalent).
4. No Prisma schema migration is needed; the schema is unchanged.
5. Open `https://YOUR-RENDER-DOMAIN/admin/login`, sign in with the configured Supabase owner account, and test the dashboard.
6. Test AI Research only after `GROQ_API_KEY` and `LANGSEARCH_API_KEY` are configured.

## Security notes
- Only the UUID in `SUPER_ADMIN_USER_ID` is authorized. A second Supabase Auth user cannot access the admin endpoints.
- The login access token is stored in an HttpOnly, Secure-in-production, SameSite=Lax cookie.
- Do not expose the Groq key, the LangSearch key or the Supabase service-role key in client-side variables.
- Add CSRF/origin protections, rate limiting, robust session refresh, audit logging and formal role tables before enabling multi-admin access.
- Research is untrusted external data. Review all pricing, benchmark scores, dates and source URLs in the preview before approving.
