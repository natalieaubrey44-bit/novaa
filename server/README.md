# Dev Auth Server (demo)

This small Express server provides demo authentication endpoints for local development and testing.

Features
- Separate user and admin login endpoints
- CSRF double-submit tokens (`/api/auth/csrf/:flow`)
- Rate limiting (user/admin)
- Per-role JWTs stored in httpOnly cookies
- Admin refresh token rotation (demo, stored server-side in-memory)
- Admin audit logging to `server/audit/admin_audit_log.json`

Running

Install deps (from repo root):

```bash
npm install
```

Start the dev auth server:

```bash
npm run server:start
```

By default it listens on port `4000`. The frontend `vite` dev server is configured to proxy `/api` to this server in `vite.config.ts`.

Environment
- `JWT_USER_SECRET` — optional override for user JWT secret
- `JWT_ADMIN_SECRET` — optional override for admin JWT secret

Notes
- This server is a demo implementation. Do not use in production. In production replace with a secure backend that persists refresh tokens, sets `secure: true` cookies, and stores audit logs in a proper log store or database.
