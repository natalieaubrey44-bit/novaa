Summary of changes for Open Account wizard and Dashboard header

What's been added

- New page: `src/pages/OpenAccount.tsx` — 4-step open account wizard (Personal, Contact, Account, Security)
  - Live validation with red/green input borders
  - Password strength meter and inline hints
  - Placeholders and suggested email/username generated from name inputs
- Auth: `src/context/AuthContext.tsx`
  - New `register` method that calls `supabase.auth.signUp` and inserts into `platform_users` (links auth user -> platform profile)
- Routing: `src/App.tsx` now includes `/open-account` route
- Navbar: `src/components/layout/Navbar.tsx` links "Open Account" to `/open-account`
- Dashboard: top header updated to show `Novaa`, `Welcome back, <FirstName>`, notification bell, circular avatar, and signed-in email
- Simple E2E script: `tests/runOpenAccount.mjs` (Playwright) to simulate the registration flow. Requires dev server running.
- Linting: TypeScript checks passed locally after changes

How to run locally

1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run dev
# or
npm start
```

3. Open the app in the browser

Visit `http://localhost:3000/open-account` and try the 4-step flow.

4. Run the E2E script (manual)

Make sure the dev server is running, then in another terminal:

```bash
npm run e2e:run
```

The script uses Playwright to open the wizard and simulate user input. It's a convenience script — you may need to adapt selectors depending on UI changes.

Notes, security & RLS

- The `register` method attempts to insert a `platform_users` row after successful signUp. If your Supabase instance has RLS enabled and requires additional policies, you should ensure the policy allows newly-authenticated users to insert their own `platform_users` row (typically `user_id = auth.uid()`).
- For production, validate server-side that profile inserts are protected using RLS policies and consider using server-side functions with service_role keys for any privileged setup.

Next recommended steps

- Add Playwright test config and run tests in CI.
- Improve accessibility: link labels with `htmlFor` and `id` attributes for inputs.
- Add email verification / confirmation flow handling after sign-up.
- Add avatar upload and store a profile image URL in `platform_users`.

If you'd like, I can now:
- Wire a full Playwright test suite and CI workflow.
- Add server-side Supabase function to initialize accounts for new users.
- Improve accessibility and keyboard navigation for the wizard.

Which of these should I do next?
