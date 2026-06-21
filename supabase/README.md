Supabase schema & seed instructions

Files:
- `schema.sql` — CREATE TABLE statements for companies, company_users, accounts, transactions, cards, notifications, auth_codes, admin_users, audit_logs.
- `seed.sql` — sample inserts (uses placeholder auth UIDs; replace with real values).

How to apply

1. Open the Supabase Project > SQL Editor and run `schema.sql`.
2. Create or invite any Auth users you need (or create via the Auth > Users UI). Note the `id` for each user (Auth user UUID).
3. Update `seed.sql` to replace `USER_AUTH_UID` placeholders with the Auth user ids, then run `seed.sql` in the SQL Editor.

Notes about RLS and policies

- After creating tables, enable Row Level Security on `accounts`, `transactions`, `notifications`, and any table holding company data.
- Add policies that allow access to rows where `company_id` matches the `company_users` entry for `auth.uid()`.

Example policy (accounts):

-- enable row level security on accounts;
-- create policy "Company members can access their accounts" on accounts
--  for select using (company_id = (select company_id from company_users where user_id = auth.uid()));

Admin rules

- Use `admin_users` to grant platform roles; admin policy exceptions can check membership in `admin_users` by `auth.uid()` or email.
