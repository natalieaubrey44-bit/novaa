-- Migration: Convert legacy companies/company_users model to platform_users + owner_user_id
-- WARNING: Destructive. BACKUP your database before running.
-- Run this in the Supabase SQL editor (requires service_role key for a full migration).

BEGIN;

-- 1) Drop every company_id column in public schema (if present)
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT table_name
    FROM information_schema.columns
    WHERE column_name = 'company_id' AND table_schema = 'public'
  LOOP
    RAISE NOTICE 'Dropping column company_id from %', r.table_name;
    EXECUTE format('ALTER TABLE public.%I DROP COLUMN IF EXISTS company_id CASCADE;', r.table_name);
  END LOOP;
END$$;

-- 2) Drop legacy company tables
DROP TABLE IF EXISTS public.company_users CASCADE;
DROP TABLE IF EXISTS public.companies CASCADE;

-- 3) Ensure target platform_users table exists (create minimal compatible shape)
CREATE TABLE IF NOT EXISTS public.platform_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  email text not null unique,
  name text,
  role text not null default 'user',
  status text not null default 'active',
  created_at timestamptz default now()
);

-- 4) Add owner_user_id, FK and index to common application tables
DO $$
DECLARE t RECORD;
  tbl_list text[] := ARRAY['accounts','transactions','cards','notifications','user_sessions'];
BEGIN
  FOR t IN
    SELECT DISTINCT table_name FROM (
      SELECT table_name FROM information_schema.columns WHERE column_name = 'owner_user_id' AND table_schema = 'public'
      UNION
      SELECT unnest(tbl_list) AS table_name
    ) AS q
  LOOP
    -- Only operate on tables that actually exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t.table_name) THEN
      RAISE NOTICE 'Ensuring owner_user_id on %', t.table_name;
      EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS owner_user_id uuid;', t.table_name);

      -- Add FK constraint if missing
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = format('%s_owner_user_id_fkey', t.table_name)
      ) THEN
        EXECUTE format(
          'ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (owner_user_id) REFERENCES public.platform_users(id) ON DELETE CASCADE;',
          t.table_name, t.table_name || '_owner_user_id_fkey'
        );
      END IF;

      EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_owner_user_id ON public.%I (owner_user_id);', t.table_name, t.table_name);
    ELSE
      RAISE NOTICE 'Skipping %, table does not exist', t.table_name;
    END IF;
  END LOOP;
END$$;

-- 5) Ensure helpful indexes
CREATE INDEX IF NOT EXISTS idx_platform_users_email ON public.platform_users(email);

COMMIT;

-- Validation queries (run after migration)
-- 1) No company_id columns remain
-- SELECT table_name FROM information_schema.columns WHERE column_name='company_id' AND table_schema='public'; -- expect 0 rows

-- 2) company tables dropped
-- SELECT to_regclass('public.companies'), to_regclass('public.company_users'); -- expect NULLs

-- 3) owner_user_id present
-- SELECT table_name FROM information_schema.columns WHERE column_name='owner_user_id' AND table_schema='public';

-- 4) foreign keys to platform_users
-- SELECT conname, conrelid::regclass::text AS table_name, pg_get_constraintdef(oid)
-- FROM pg_constraint WHERE contype='f' AND confrelid = 'public.platform_users'::regclass;

-- If you want a fully automatic variant that restricts the migration only to tables that previously had 'company_id', let me know and I'll provide that version.
