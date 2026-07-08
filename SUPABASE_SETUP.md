# Supabase setup for Novaa (concise)

This file contains exact steps to migrate legacy company data (if present), create the required schema, seed demo data, and apply RLS policies. Run the SQL in this order from an empty or legacy database.

Required env vars:

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — public anon key (frontend)
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (server-side migrations)

0. Legacy company-model migration (only if your live DB contains `companies`/`company_users` or `company_id` columns)

- This is destructive and intended for demo projects without production data. BACKUP before running.
- Run the migration to remove legacy artifacts and add `owner_user_id` columns:

```sql
\i supabase/migrate_company_to_platform.sql
```

1. Apply canonical schema

- Apply `supabase/schema.sql` (run the whole file). Order: extensions → tables → indexes.

2. Seed demo data

- Apply `supabase/seed.sql` after the schema. Seed creates example `platform_users`, `admin_users`, starter `accounts`, and `transactions`.

3. Apply RLS policies

- Apply the prepared policies file (this enables RLS and creates policies):

```sql
\i supabase/rls_policies.sql
```

4. Auth configuration

- Email confirmations: optional. If enabled, users must confirm email before sign-in. For demo flows without email confirmation, disable it in Auth settings.

5. Post-apply validation (run these queries in the SQL editor)

```sql
-- No legacy company artifacts remain
SELECT table_name, column_name FROM information_schema.columns WHERE column_name = 'company_id' AND table_schema = 'public';
SELECT to_regclass('public.companies'), to_regclass('public.company_users');

-- owner_user_id exists on expected tables
SELECT table_name FROM information_schema.columns WHERE column_name = 'owner_user_id' AND table_schema = 'public' ORDER BY table_name;

-- foreign keys to platform_users
SELECT conname, conrelid::regclass::text AS table_name, pg_get_constraintdef(oid)
FROM pg_constraint WHERE contype='f' AND confrelid = 'public.platform_users'::regclass;

-- RLS enabled and policies present
SELECT relname, relrowsecurity FROM pg_class WHERE relname IN ('platform_users','accounts','transactions','notifications','cards','user_sessions');
SELECT * FROM pg_policies WHERE schemaname='public';
```

6. Verification checklist (manual)

- `select count(*) from platform_users;` returns seeded rows.
- Sign in via UI and verify `supabase.auth.getSession()` returns a live session.
- Network tab shows requests to `https://<project>.supabase.co` during sign-in and data fetches.
- RLS: a non-owner user should be blocked from selecting rows in `accounts`/`transactions`.

Notes

- `admin_auth_codes` and `user_auth_codes` were removed from schema and seed to match the UI which now uses email/password authentication only.
