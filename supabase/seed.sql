-- Seed data for Novaa (run after schema.sql)
-- NOTE: To create `company_users` entries that link to Supabase Auth users, replace USER_AUTH_UID with the real auth user id from Supabase Auth.

insert into companies (id, name, domain) values
  ('00000000-0000-0000-0000-000000000001', 'Novaa Test Company', 'novaa.test')
on conflict do nothing;

-- Example admin user (platform admin)
insert into admin_users (id, user_id, email, name, role, status)
values
  ('00000000-0000-0000-0000-000000000010', null, 'tara.morgan@novaa.com', 'Tara Morgan', 'admin', 'active')
on conflict do nothing;

-- Admin auth codes (two sets, rotated every 30 days)
-- Set 1: codes for this month
insert into admin_auth_codes (id, admin_id, code_set, code_1, code_2, code_3, expires_at, is_used, created_at)
values
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000010', 1, 'ADMIN001', 'ADMIN002', 'ADMIN003', now() + interval '30 days', false, now())
on conflict do nothing;

-- Set 2: standby codes (for next month)
insert into admin_auth_codes (id, admin_id, code_set, code_1, code_2, code_3, expires_at, is_used, created_at)
values
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000010', 2, 'ADMIN004', 'ADMIN005', 'ADMIN006', now() + interval '60 days', false, now())
on conflict do nothing;

-- User enrollment codes (admin must generate these for new users to sign up)
-- These are examples; admin generates them via dashboard
insert into user_auth_codes (id, admin_id, email, code, is_used, expires_at, created_at)
values
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000010', 'alex.carter@novaa.test', 'USER-ABC123XYZ', false, now() + interval '7 days', now()),
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000010', 'marcus.fredebel@novaa.test', 'USER-DEF456UVW', false, now() + interval '7 days', now())
on conflict do nothing;

-- Example company user placeholder: replace USER_AUTH_UID with actual auth.users.id
-- insert into company_users (id, user_id, company_id, role)
-- values ('00000000-0000-0000-0000-000000000011', 'USER_AUTH_UID', '00000000-0000-0000-0000-000000000001', 'user');

-- Create a couple accounts
insert into accounts (id, company_id, name, currency_code, balance, type)
values
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Corporate Operating Fund', 'USD', 15132500.00, 'checking'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Treasury Reserves', 'USD', 28950000.00, 'savings')
on conflict do nothing;

-- Example transactions
insert into transactions (id, account_id, company_id, amount, currency_code, description, category, status, type)
values
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 185420.00, 'USD', 'Enterprise AWS Cloud Cluster Systems', 'Infrastructure', 'completed', 'withdrawal')
on conflict do nothing;
