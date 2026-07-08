-- Seed data for Novaa (run after schema.sql)
-- NOTE: To create platform_users entries that link to Supabase Auth users, replace USER_AUTH_UID with the real auth user id from Supabase Auth.

-- Example platform user records
-- Insert a single platform user for demo. Set `user_id` to NULL and link after creating an Auth user.
insert into platform_users (id, user_id, email, name, role, status)
values
  ('00000000-0000-0000-0000-000000000020', NULL, 'tamayonorma810@gmail.com', 'Alex Carter', 'user', 'active')
on conflict do nothing;

-- Example admin users (platform-wide global admins)
-- Single admin user for demo
insert into admin_users (id, user_id, email, name, role, status)
values
  ('00000000-0000-0000-0000-000000000010', null, 'natalieaubrey44@gmail.com', 'Tara Morgan', 'admin', 'active')
on conflict do nothing;

-- Admin auth codes (two sets, rotated every 30 days)
-- Set 1: codes for this month
-- Note: admin/user auth-code seed rows removed because login now uses
-- Supabase email/password authentication. Seed includes platform users,
-- admin_users, starter accounts, and transactions only.

-- Example platform user placeholder: after creating an Auth user, link it:
-- UPDATE platform_users SET user_id = '<AUTH_USER_ID>' WHERE email = 'tamayonorma810@gmail.com';

-- Starter accounts
insert into accounts (id, owner_user_id, name, currency_code, balance, type)
values
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000020', 'Primary Operating Fund', 'USD', 15132500.00, 'checking'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000020', 'Reserve Treasury', 'USD', 28950000.00, 'savings')
on conflict do nothing;

-- Starter transactions
insert into transactions (id, account_id, owner_user_id, amount, currency_code, description, category, status, type)
values
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000020', 185420.00, 'USD', 'Operational expense sync', 'Infrastructure', 'completed', 'withdrawal')
on conflict do nothing;
