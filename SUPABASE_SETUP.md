# Supabase setup for Novaa

This guide is for a manual Supabase setup before the demo. It is intentionally non-destructive and does not execute anything against a live project.

## 1. Create or open the Supabase project

1. Open your Supabase project dashboard.
2. Go to Project Settings > API.
3. Note the following values:
   - Project URL
   - Project API key (anon/public key)
   - Service role key (only needed for server-side or admin scripts; do not expose it in the frontend)
4. In the local repo, create a real environment file named .env (not .env.example) in the project root.

Example:

```env
VITE_SUPABASE_URL="https://<project-ref>.supabase.co"
VITE_SUPABASE_ANON_KEY="<anon-or-public-key>"
```

### Which values are required?

- Required for the UI demo/auth flow: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Optional for local UI-only demo: `APP_URL`
- Required for server-side auth scripts or migrations: `SUPABASE_SECRET_KEY` or service-role key

> Safe placeholders for a UI-only demo: `APP_URL=http://localhost:3000` only. Do not leave the Supabase URL/key as placeholders if you want auth to function.

## 2. Create the tables in Supabase SQL editor

Run the SQL below in the Supabase SQL Editor in this order. It reflects the schema used by the current frontend code.

```sql
create extension if not exists pgcrypto;

create table if not exists platform_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  email text not null unique,
  name text,
  role text not null default 'user',
  status text not null default 'active',
  created_at timestamptz default now()
);

create index if not exists idx_platform_users_email on platform_users(email);

create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references platform_users(id) on delete cascade,
  name text not null,
  currency_code varchar(3) not null default 'USD',
  balance numeric default 0,
  type text not null,
  created_at timestamptz default now()
);

create index if not exists idx_accounts_owner_user_id on accounts(owner_user_id);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  owner_user_id uuid not null references platform_users(id) on delete cascade,
  auth_user_id uuid,
  fx_rate numeric default 1,
  currency_code varchar(3) not null default 'USD',
  amount numeric not null,
  description text,
  category text,
  status text default 'pending',
  type text,
  created_at timestamptz default now()
);

create index if not exists idx_transactions_account_id on transactions(account_id);

create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references accounts(id) on delete cascade,
  owner_user_id uuid not null references platform_users(id) on delete cascade,
  last4 varchar(4),
  holder_name text,
  expiry_month int,
  expiry_year int,
  is_frozen boolean default false,
  limit_amount numeric default 0,
  created_at timestamptz default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references platform_users(id) on delete cascade,
  title text,
  message text,
  type text,
  read boolean default false,
  created_at timestamptz default now()
);

create table if not exists auth_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  code text,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text,
  name text,
  role text not null default 'admin',
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  actor_email text,
  action text,
  meta jsonb,
  created_at timestamptz default now()
);

create table if not exists admin_auth_codes (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references admin_users(id) on delete cascade,
  code_set int not null,
  code_1 text not null,
  code_2 text not null,
  code_3 text not null,
  expires_at timestamptz not null,
  is_used boolean default false,
  created_at timestamptz default now()
);

create table if not exists user_auth_codes (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references admin_users(id) on delete cascade,
  email text not null,
  code text not null unique,
  is_used boolean default false,
  used_by_user_id uuid references platform_users(id) on delete set null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

create table if not exists user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references platform_users(id) on delete cascade,
  session_token text not null unique,
  ip_address text,
  user_agent text,
  expires_at timestamptz not null,
  last_activity_at timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists idx_user_sessions_user_id on user_sessions(user_id);
create index if not exists idx_user_sessions_expires on user_sessions(expires_at);

create table if not exists rate_limits (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  failed_attempts int default 0,
  last_failed_at timestamptz,
  lockout_until timestamptz,
  admin_override_until timestamptz,
  created_at timestamptz default now(),
  unique(email)
);

create index if not exists idx_rate_limits_email on rate_limits(email);
```

## 3. Decide whether to run seed.sql

Seed data is recommended for a UI-only demo because it populates the demo login codes and starter data the frontend expects.

### What seed.sql inserts

- Admin records in `admin_users`
- Admin security code sets in `admin_auth_codes`
- Demo user enrollment codes in `user_auth_codes`
- Starter platform user rows in `platform_users`
- Starter accounts and transactions in `accounts` and `transactions`

### Recommended approach

- For a UI-only demo: run `seed.sql` after the schema.
- For a real production-like auth flow: run the schema first, then create your own users and codes manually instead of relying on the demo seed rows.

## 4. Enable row-level security (RLS)

The current schema includes RLS notes, but the app itself is currently using the public anon key for a demo flow. For a real deployment, enable RLS on the tables that hold user-owned data and create matching policies.

### Minimum policy example

```sql
alter table platform_users enable row level security;
alter table accounts enable row level security;
alter table transactions enable row level security;
alter table notifications enable row level security;
alter table user_sessions enable row level security;

create policy "platform_users_owner_access"
  on platform_users
  for select
  using (user_id = auth.uid());

create policy "accounts_owner_access"
  on accounts
  for select
  using (owner_user_id = (select id from platform_users where user_id = auth.uid()));

create policy "transactions_owner_access"
  on transactions
  for select
  using (owner_user_id = (select id from platform_users where user_id = auth.uid()));

create policy "notifications_owner_access"
  on notifications
  for select
  using (owner_user_id = (select id from platform_users where user_id = auth.uid()));
```

If you are running a UI-only demo with anon access and no real auth users yet, you can skip RLS for now and simply use the seeded demo data.

## 5. Verification checklist

After setup, verify each item:

- The app starts locally with the real `.env` values and the login page is visible.
- Querying `select * from admin_users;` returns the seeded admin rows.
- Querying `select * from user_auth_codes where email = 'alex.carter@novaa.test';` returns a valid code.
- The login page demo buttons and manual login path work with the seeded values.
- The admin login page can find an admin user from `admin_users` and validate the demo code set.

## 6. Where to find the values in the Supabase dashboard

- Project Settings > API > Project URL
- Project Settings > API > Project API keys > `anon` / `public`
- Project Settings > API > Project API keys > `service_role` (server-side only)
- Authentication > Settings > URL configuration if you want to enable redirect flows
