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
