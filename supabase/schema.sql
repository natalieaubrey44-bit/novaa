-- Supabase schema for Novaa
-- Run this in the Supabase SQL editor or via the supabase CLI (requires service_role key for migrations)

-- Enable UUID generation
create extension if not exists pgcrypto;

-- Platform-level users (one user represents one company/person)
drop table if exists platform_users cascade;
create table platform_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid
  , -- references auth.users.id (nullable; link after creating Auth user)
  email text not null unique,
  name text,
  role text not null default 'user',
  status text not null default 'active',
  created_at timestamptz default now()
);

create index if not exists idx_platform_users_email on platform_users(email);

-- accounts belong to the platform user
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

-- transactions
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

-- cards
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

-- notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references platform_users(id) on delete cascade,
  title text,
  message text,
  type text,
  read boolean default false,
  created_at timestamptz default now()
);

-- auth_codes (for 2FA / magic links)
create table if not exists auth_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  code text,
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- admin users (separate from company_users) for platform-level roles
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid, -- link to auth.users when available
  email text,
  name text,
  role text not null default 'admin',
  status text default 'active',
  created_at timestamptz default now()
);

-- audit logs
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  actor_email text,
  action text,
  meta jsonb,
  created_at timestamptz default now()
);
-- NOTE: admin_auth_codes and user_auth_codes were removed — login now uses
-- email/password via Supabase Auth. If you need enrollment codes in the
-- future, reintroduce an appropriately named table and update the UI.

-- sessions: track active user sessions (max 10 concurrent per company)
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

-- rate limits: track failed login attempts per email
create table if not exists rate_limits (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  failed_attempts int default 0,
  last_failed_at timestamptz,
  lockout_until timestamptz,
  admin_override_until timestamptz, -- admin can reset or extend lockout
  created_at timestamptz default now(),
  unique(email)
);

create index if not exists idx_rate_limits_email on rate_limits(email);

-- RLS / Policy notes (apply policies in the Supabase UI)
-- Example (apply after enabling RLS on a table):
-- enable row level security on accounts;
-- create policy "platform users can access" on accounts using (owner_user_id = (select id from platform_users where user_id = auth.uid()));

-- Important: create policies for platform_users, accounts, transactions to restrict by owner_user_id
