-- RLS policies for Novaa (apply after schema + migration)

-- Enable RLS
ALTER TABLE public.platform_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- platform_users: allow a user to select their own profile
DROP POLICY IF EXISTS platform_users_owner_select ON public.platform_users;
CREATE POLICY platform_users_owner_select
  ON public.platform_users FOR SELECT
  USING (user_id = auth.uid());

-- accounts: allow owner to select rows
DROP POLICY IF EXISTS accounts_owner_select ON public.accounts;
CREATE POLICY accounts_owner_select
  ON public.accounts FOR SELECT
  USING (owner_user_id = (SELECT id FROM public.platform_users WHERE user_id = auth.uid()));

-- transactions: allow owner access
DROP POLICY IF EXISTS transactions_owner_select ON public.transactions;
CREATE POLICY transactions_owner_select
  ON public.transactions FOR SELECT
  USING (owner_user_id = (SELECT id FROM public.platform_users WHERE user_id = auth.uid()));

-- notifications: allow owner access
DROP POLICY IF EXISTS notifications_owner_select ON public.notifications;
CREATE POLICY notifications_owner_select
  ON public.notifications FOR SELECT
  USING (owner_user_id = (SELECT id FROM public.platform_users WHERE user_id = auth.uid()));

-- cards: allow owner access
DROP POLICY IF EXISTS cards_owner_select ON public.cards;
CREATE POLICY cards_owner_select
  ON public.cards FOR SELECT
  USING (owner_user_id = (SELECT id FROM public.platform_users WHERE user_id = auth.uid()));

-- user_sessions: owner access
DROP POLICY IF EXISTS user_sessions_owner_select ON public.user_sessions;
CREATE POLICY user_sessions_owner_select
  ON public.user_sessions FOR SELECT
  USING (user_id = (SELECT id FROM public.platform_users WHERE user_id = auth.uid()));

-- Optional: add INSERT/UPDATE/DELETE policies as needed for app behavior.
