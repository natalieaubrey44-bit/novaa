-- Supabase schema for Novaa
-- Run this in the Supabase SQL editor or via the supabase CLI (requires service_role key for migrations)

-- Enable UUID generation
create extension if not exists pgcrypto;

-- companies: anchor for tenant data
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text,
  created_at timestamptz default now()
);

-- users are managed by Supabase Auth; this table links auth users to companies
create table if not exists company_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null, -- references auth.users.id
  company_id uuid not null references companies(id) on delete cascade,
  role text not null default 'user',
  created_at timestamptz default now(),
  unique(user_id)
);

create index if not exists idx_company_users_company_id on company_users(company_id);

-- accounts belong to companies
create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  currency_code varchar(3) not null default 'USD',
  balance numeric default 0,
  type text not null,
  created_at timestamptz default now()
);

create index if not exists idx_accounts_company_id on accounts(company_id);

-- transactions
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  company_id uuid not null references companies(id) on delete cascade,
  auth_user_id uuid, -- optional link to auth.users
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
  company_id uuid not null references companies(id) on delete cascade,
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
  company_id uuid references companies(id) on delete cascade,
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

-- RLS / Policy notes (apply policies in the Supabase UI)
-- Example (apply after enabling RLS on a table):
-- enable row level security on accounts;
-- create policy "company users can access" on accounts using (company_id = (select company_id from company_users where user_id = auth.uid()));

-- Important: create policies for companies, accounts, transactions to restrict by company_id
