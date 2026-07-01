# Novaa Authentication & Authorization System - Complete Implementation Guide

**Date**: June 2026  
**Status**: Implementation Specification  
**Version**: 1.0

---

## Executive Summary

Novaa is implementing a three-tier authentication and authorization system:
1. **User tier**: email + password + admin-generated enrollment codes
2. **Admin tier**: username (email) + password + dual rotating security code sets
3. **System tier**: Supabase as the authoritative backend with row-level security (RLS)

This document explains the complete auth flow, what has been implemented, what still needs to be done, and the security model.

---

## 1. What the App is Intended to Do

### 1.1 User Experience Flow (Regular Users/Customers)

A regular user's banking experience should work like this:

**Before they can sign up:**
- An admin must generate an **enrollment code** for them
- The code is valid for 7 days
- The code is tied to a specific email address

**When they try to log in:**
- They enter their **email** (not a username)
- They enter their **password**
- They enter the **enrollment code** (which admin gave them)
- The system validates all three
- If successful, they see their personal banking dashboard with:
  - Their accounts and balances
  - Their transaction history
  - Their cards
  - Ability to transfer funds, pay bills, freeze cards
  - Notifications

**Session management:**
- Max 10 concurrent user sessions site-wide
- Infrastructure is prepared to extend to 50 users in the future
- Sessions expire after 30 minutes of inactivity
- Users can see all pages in their dashboard (no page restrictions within the user dashboard)

**Security:**
- If a user fails password 3 times → locked for 5 minutes
- If they fail 5 times → locked for 30 minutes
- If they fail 7+ times → locked for 1 hour
- An admin can override this at any time (e.g., send a "login approval link" or remove the lockout)

### 1.2 Admin Experience Flow (Bank Headquarters)

An admin is the "bank headquarters" with mini dashboard control:

**Before they can log in:**
- Their account must be created by the platform owner
- They receive two sets of **rotating security codes** (Set 1: active, Set 2: standby)
- Codes rotate every 30 days automatically

**When they log in:**
- They enter their **username** (their email address)
- They enter their **master password**
- They enter three **security codes** from either the active or standby set (order matters)
- The system validates all three
- If successful, they access the admin console

**What they can do:**
- Generate enrollment codes for new users
- View all users in their company
- View all accounts, balances, and transactions
- **Inject fake bank data** (change balances, add transactions)
- **Approve/confirm transactions** (mark as completed or pending)
- **Hold/withhold funds** (place transactions on hold)
- **View and override rate limiting** for users who are locked out
- **View audit logs** of all admin and user actions
- Manage company settings

**Constraints:**
- There are exactly two global admins with equal permissions
- Each admin must have a valid active or upcoming code set
- Codes must be configured beforehand (not auto-generated on login)
- All admin actions are logged in `audit_logs` table

### 1.3 System Constraints & Business Rules

**Maximum concurrent sessions:**
- 1 admin per company (or configurable per platform rules)
- Max 10 users logged in simultaneously site-wide
- Infrastructure is sized for up to 50 users in the long run
- If a user tries to log in and 10 users are already logged in, the oldest session expires

**One-person-per-account rule (CRITICAL):**
- User A cannot log into User B's account
- Enforcement: email is the unique identifier + auth code is email-specific
- If User A tries with User B's email but doesn't have User B's enrollment code, login fails

**Data access control:**
- Users only see their own company's data (enforced by Supabase RLS)
- Admins see their own company's data + can override RLS for management purposes
- No cross-company data leakage

**Real emails only (users):**
- User login uses **email only** (no username field on user login page)
- Admin login uses **username** (which is an email, but admin-specific)
- All authentication is email-based for audit trail purposes

---

## 2. What Needs to be Implemented - Client-Side

### 2.1 Authentication State Management (`src/context/AuthContext.tsx`)

**Current status**: Partially done - Supabase auth wired, but missing full flows.

**What needs to be added:**

1. **Session token storage & validation**
   - Store `session_token` in a secure HTTP-only cookie after successful login
   - On app load, retrieve session token from Supabase Auth
   - Validate session token is not expired and matches `user_sessions` table
   - If invalid, clear local state and redirect to login

2. **User role + company resolution**
   - After successful Supabase auth, query `company_users` table
   - Extract `role` and `company_id`
   - For admins, also query `admin_users` table
   - Store in `AuthContext.user`: `{ id, email, name, role, companyId }`

3. **Rate limit state**
   - Track failed login attempts locally (for UX feedback)
   - Display lockout message if user is rate-limited
   - Show admin override message if applicable

4. **Logout handling**
   - Call `supabase.auth.signOut()`
   - Delete session token from `user_sessions` table
   - Clear all local auth state
   - Redirect to `/login`

5. **Session expiration listener**
   - Listen to `supabase.auth.onAuthStateChange()`
   - If session expires, redirect to login automatically
   - Clear all cached data

### 2.2 User Login Page (`src/pages/Login.tsx`)

**Current status**: Done - auth code + rate limiting integrated.

**Ensures:**
- ✅ Email-only input (no username field)
- ✅ Password field
- ✅ Auth code field (required, must be from Supabase `user_auth_codes`)
- ✅ Rate limiting feedback (shows remaining lockout time)
- ✅ Admin override message (if applicable)
- ✅ Demo account buttons pre-populated with emails + codes
- ✅ Clear error messages for invalid codes, expired codes, rate limit

**Already implemented**:
- Auth code validation against `user_auth_codes` table
- Progressive rate limiting (1 min → 5 min → 30 min)
- Failed attempt logging to `rate_limits` table
- Admin override detection

### 2.3 Admin Login Page (`src/pages/AdminLogin.tsx`)

**Current status**: Done - username + password + dual code sets integrated.

**Ensures:**
- ✅ Username field (email address of admin)
- ✅ Password field
- ✅ Three code input fields (for the security code set)
- ✅ Code validation against `admin_auth_codes` table (checks both active and standby sets)
- ✅ Code set expiration checking
- ✅ Audit logging on successful login

**Already implemented**:
- Username lookup in `admin_users` table
- Active/standby code set validation
- Expiration checking
- Audit log insertion on success

### 2.4 User Dashboard Pages

**Current status**: Not yet updated to use real Supabase data.

**What needs to be added:**

1. **Account data loading**
   - Query `accounts` table where `company_id` matches user's company
   - Display real balances, types, currencies from DB (not mocked)

2. **Transaction history**
   - Query `transactions` table filtered by user's `company_id`
   - Show status, amount, description, category from DB
   - Allow status filtering (pending, completed, held)

3. **Cards**
   - Query `cards` table for user's company
   - Display real card data from DB

4. **Notifications**
   - Query `notifications` table for user's company
   - Mark as read/unread via DB update

5. **Transfers & bill pay**
   - Still use mocked behavior for now (update DB after admin approves)
   - Or: implement real transfers that update `accounts.balance` + insert `transactions`

### 2.5 Admin Dashboard Pages

**Current status**: Partially done - pages exist but use mocked data.

**What needs to be added:**

1. **User Management**
   - List all users in company from `company_users` table
   - Show status, role, last login from DB
   - Ability to generate enrollment codes
   - Ability to reset rate limits for locked-out users
   - Ability to revoke/manage users

2. **User Enrollment Code Generation**
   - Form to generate new `user_auth_codes` with:
     - Target email address
     - Expiration date (default: 7 days)
   - Insert into `user_auth_codes` table
   - Display generated code to admin (to share with user)

3. **Accounts & Balances**
   - List all accounts in company from `accounts` table
   - **Admin capability**: Edit balance directly (inject fake data)
   - **Admin capability**: Change currency
   - **Admin capability**: Delete/archive accounts

4. **Transactions Management**
   - List all transactions from `transactions` table
   - **Admin capability**: Approve/confirm pending transactions (update status to 'completed')
   - **Admin capability**: Hold transactions (update status to 'held')
   - **Admin capability**: Cancel transactions (update status to 'cancelled')
   - **Admin capability**: Inject new transactions (insert into `transactions`)

5. **Rate Limit Management**
   - List all rate-limited users from `rate_limits` table
   - Show current lockout status, failed attempts
   - **Admin capability**: Clear lockout (set `lockout_until` to NULL, `failed_attempts` to 0)
   - **Admin capability**: Set admin override (set `admin_override_until` to future timestamp)
   - **Admin capability**: Remove override

6. **Audit Logs**
   - Display all logs from `audit_logs` table
   - Filter by action, actor, date range
   - Show who did what and when

7. **Settings**
   - Company name, domain, settings
   - Admin code rotation schedule (view/manage)
   - Session limits (max concurrent users)

### 2.6 Route Guards & Protected Components

**Current status**: Partially done - basic checks in place.

**What needs to be added:**

1. **Session validation on route change**
   - Before rendering protected routes, check:
     - User is logged in (session exists)
     - Session token is not expired
     - User's role matches route requirements

2. **Admin-only routes**
   - `/admin/*` → only accessible if `user.role === 'admin'`
   - Otherwise redirect to `/admin/login`

3. **User-only routes**
   - `/dashboard/*` → only accessible if `user.role === 'user'` or 'support'
   - Otherwise redirect to `/login`

4. **Public routes**
   - `/`, `/login`, `/admin/login`, `/resources`, etc. → accessible to all

---

## 3. What Needs to be Implemented - Server-Side (Supabase)

### 3.1 Database Schema

**Current status**: Schema SQL files created, but NOT YET DEPLOYED.

**Tables that need to exist** (deploy `supabase/schema.sql`):

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `companies` | Tenant/company anchor | id, name, domain, created_at |
| `company_users` | Links auth users to companies | id, user_id, company_id, role, created_at |
| `accounts` | Bank accounts | id, company_id, name, currency_code, balance, type, created_at |
| `transactions` | Transaction history | id, account_id, company_id, amount, currency_code, description, category, status, type, created_at |
| `cards` | Debit/credit cards | id, account_id, company_id, last4, holder_name, expiry_month, expiry_year, is_frozen, limit_amount, created_at |
| `notifications` | User notifications | id, company_id, title, message, type, read, created_at |
| `admin_auth_codes` | Admin security codes (two sets) | id, admin_id, code_set (1 or 2), code_1, code_2, code_3, expires_at, is_used, created_at |
| `user_auth_codes` | User enrollment codes | id, admin_id, email, code, is_used, used_by_user_id, expires_at, created_at |
| `user_sessions` | Active user sessions (max 10) | id, user_id, session_token, ip_address, user_agent, expires_at, last_activity_at, created_at |
| `rate_limits` | Failed login tracking | id, email, failed_attempts, last_failed_at, lockout_until, admin_override_until, created_at |
| `auth_codes` | Generic auth codes (2FA, magic links) | id, user_id, code, expires_at, created_at |
| `admin_users` | Admin accounts | id, user_id, email, name, role, status, created_at |
| `audit_logs` | Audit trail of actions | id, actor_user_id, actor_email, action, meta (JSON), created_at |

**To deploy:**
```bash
# In Supabase SQL Editor, run:
-- 1. Copy all CREATE TABLE statements from supabase/schema.sql
-- 2. Run them in order
-- 3. Verify tables exist
```

### 3.2 Row-Level Security (RLS) Policies

**Current status**: Not yet enabled.

**Policies needed:**

1. **On `accounts` table**
   ```sql
   -- Enable RLS
   ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
   
   -- Users can see accounts in their company only
   CREATE POLICY company_can_select_accounts ON accounts
     FOR SELECT USING (
       company_id = (SELECT company_id FROM company_users WHERE user_id = auth.uid())
     );
   
   -- Admins can see all accounts (bypass RLS for their company)
   CREATE POLICY admin_can_select_all_accounts ON accounts
     FOR SELECT USING (
       EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid() AND au.role = 'admin')
     );
   
   -- Users cannot update accounts directly
   -- Admins can update (for balance injection, currency changes)
   CREATE POLICY admin_can_update_accounts ON accounts
     FOR UPDATE USING (
       EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid() AND au.role = 'admin')
     );
   ```

2. **On `transactions` table**
   ```sql
   ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
   
   -- Users can see transactions in their company only
   CREATE POLICY company_can_select_transactions ON transactions
     FOR SELECT USING (
       company_id = (SELECT company_id FROM company_users WHERE user_id = auth.uid())
     );
   
   -- Admins can see all transactions
   CREATE POLICY admin_can_select_all_transactions ON transactions
     FOR SELECT USING (
       EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid() AND au.role = 'admin')
     );
   
   -- Admins can update transaction status (approve, hold, cancel)
   CREATE POLICY admin_can_update_transactions ON transactions
     FOR UPDATE USING (
       EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid() AND au.role = 'admin')
     );
   
   -- Admins can insert new transactions
   CREATE POLICY admin_can_insert_transactions ON transactions
     FOR INSERT WITH CHECK (
       EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid() AND au.role = 'admin')
     );
   ```

3. **On `cards` table**
   ```sql
   ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
   
   -- Similar to accounts: users see own company, admins see all
   CREATE POLICY company_can_select_cards ON cards
     FOR SELECT USING (
       company_id = (SELECT company_id FROM company_users WHERE user_id = auth.uid())
     );
   ```

4. **On `notifications` table**
   ```sql
   ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
   
   -- Users can see notifications for their company only
   CREATE POLICY company_can_select_notifications ON notifications
     FOR SELECT USING (
       company_id = (SELECT company_id FROM company_users WHERE user_id = auth.uid())
     );
   ```

5. **On `user_auth_codes` table**
   ```sql
   ALTER TABLE user_auth_codes ENABLE ROW LEVEL SECURITY;
   
   -- Admins can view and insert enrollment codes
   CREATE POLICY admin_can_view_auth_codes ON user_auth_codes
     FOR SELECT USING (
       EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid())
     );
   
   CREATE POLICY admin_can_insert_auth_codes ON user_auth_codes
     FOR INSERT WITH CHECK (
       EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid())
     );
   ```

6. **On `rate_limits` table**
   ```sql
   ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
   
   -- Public can view (for login flow)
   -- This might need a service role bypass or trigger-based updates
   -- For now, allow all to read
   CREATE POLICY public_can_select_rate_limits ON rate_limits
     FOR SELECT USING (true);
   
   -- Only allow inserts/updates via Supabase functions or service role
   ```

7. **On `admin_users` table**
   ```sql
   ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
   
   -- Admins can view other admins
   CREATE POLICY admin_can_select_admin_users ON admin_users
     FOR SELECT USING (
       EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid() AND au.role = 'admin')
     );
   ```

8. **On `audit_logs` table**
   ```sql
   ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
   
   -- Only admins can view audit logs
   CREATE POLICY admin_can_select_audit_logs ON audit_logs
     FOR SELECT USING (
       EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid() AND au.role = 'admin')
     );
   
   -- Supabase functions/service role can insert logs
   ```

**To deploy:**
```bash
# In Supabase SQL Editor, run each policy CREATE statement
# Verify by checking Supabase Dashboard > Authentication > Policies
```

### 3.3 Triggers & Automated Tasks

**Needed:**

1. **Auto-rotate admin codes every 30 days**
   ```sql
   -- Trigger to mark Set 1 as expired and activate Set 2 after 30 days
   -- Or create a scheduled function (Supabase Edge Function)
   ```

2. **Prune expired sessions**
   ```sql
   -- Delete old sessions from user_sessions table
   -- Scheduled daily cleanup
   ```

3. **Auto-clear rate limits after lockout expires**
   ```sql
   -- Optional: let the client check, or use a function
   ```

### 3.4 Seed Data

**Current status**: Seed SQL created (`supabase/seed.sql`), needs to be deployed.

**To deploy:**
```bash
# In Supabase SQL Editor, run supabase/seed.sql
# This creates:
# - 1 company (Novaa Test Company)
# - 1 admin user (tara.morgan@novaa.com)
# - 2 admin auth code sets (Set 1 & Set 2)
# - 2 user enrollment codes (for alex.carter@novaa.test & marcus.fredebel@novaa.test)
# - 2 sample accounts
# - 1 sample transaction
```

### 3.5 Backend Functions (Optional but Recommended)

**Supabase Edge Functions** to handle complex logic:

1. **`check-rate-limit`**
   - Input: email
   - Output: { isLocked: bool, remainingMinutes: number, canOverride: bool }
   - Called during login

2. **`generate-auth-code`**
   - Input: admin_id, target_email, expires_in_days
   - Output: { code: string, expiresAt: timestamp }
   - Generates unique enrollment code for user

3. **`validate-admin-codes`**
   - Input: admin_id, code1, code2, code3
   - Output: { valid: bool, codeSet: 1|2 }
   - Validates three-code set

4. **`create-session-token`**
   - Input: user_id
   - Output: { token: string, expiresAt: timestamp }
   - Creates and stores session token

5. **`end-session-token`**
   - Input: session_token
   - Output: { success: bool }
   - Marks session as expired

---

## 4. Data Flow Diagrams

### 4.1 User Login Flow

```
User visits /login
    ↓
Enters: email, password, auth code
    ↓
Client validates:
  - Auth code exists in user_auth_codes for this email ✓
  - Auth code not already used ✓
  - Auth code not expired ✓
  - User not rate-limited (or admin override active) ✓
    ↓
Client calls: supabase.auth.signInWithPassword(email, password)
    ↓
Supabase Auth validates password
    ↓
Auth successful → returns session + JWT
    ↓
Client marks auth code as used (update user_auth_codes.is_used = true)
    ↓
Client resets rate limits (update rate_limits.failed_attempts = 0)
    ↓
Client creates session token in user_sessions table
    ↓
Client queries company_users to get company_id + role
    ↓
Client sets AuthContext.user = { email, role, companyId, ... }
    ↓
Client redirects to /dashboard
    ↓
Dashboard queries accounts, transactions, cards, notifications for this company
```

### 4.2 Admin Login Flow

```
Admin visits /admin/login
    ↓
Enters: username (email), password, code_1, code_2, code_3
    ↓
Client validates:
  - Admin exists in admin_users with this email ✓
  - Admin status = 'active' ✓
  - Code set is valid (either Set 1 or Set 2 matches codes in order) ✓
  - Code set not expired ✓
    ↓
Client calls: supabase.auth.signInWithPassword(email, password)
    ↓
Auth successful → returns session + JWT
    ↓
Client inserts audit log: { actor_email, action: 'admin_login_success', ... }
    ↓
Client creates session token in user_sessions table
    ↓
Client queries admin_users to get admin role + company access
    ↓
Client sets AuthContext.user = { email, role: 'admin', companyId, ... }
    ↓
Client redirects to /admin
    ↓
Admin dashboard loads company users, accounts, transactions, rate limits
```

### 4.3 Admin Generates User Enrollment Code

```
Admin visits /admin/users
    ↓
Admin enters target email + clicks "Generate Code"
    ↓
Client generates unique code (e.g., USER-ABC123XYZ)
    ↓
Client inserts into user_auth_codes:
  {
    admin_id: current_admin.id,
    email: target_email,
    code: 'USER-ABC123XYZ',
    is_used: false,
    expires_at: now() + 7 days
  }
    ↓
Client displays code to admin (to copy + share with user)
    ↓
Admin sends code to user (via email, Slack, etc.)
    ↓
User receives code and uses it to sign up + login
```

### 4.4 Admin Injects Fake Bank Data

```
Admin visits /admin/accounts
    ↓
Admin sees list of all company accounts (from accounts table)
    ↓
Admin clicks "Edit Balance" on an account
    ↓
Admin enters new balance + optional reason
    ↓
Client updates accounts.balance = new_value
    ↓
Client inserts audit log: { action: 'balance_change', meta: { old, new, reason } }
    ↓
User sees updated balance next time they refresh dashboard
    ↓
(Optional: send user a notification about balance change)
```

---

## 5. Security Model

### 5.1 Authentication Layers

| Layer | Mechanism | Enforcement |
|-------|-----------|-------------|
| **Layer 1: Email** | User's email is unique identifier | Supabase Auth unique constraint |
| **Layer 2: Password** | User/admin password hashed by Supabase Auth | bcrypt, 256-bit salt |
| **Layer 3: Enrollment Code** (users only) | Admin-generated single-use code | Checked in `user_auth_codes` table |
| **Layer 4: Security Codes** (admins only) | Two rotating sets of three codes each | Checked in `admin_auth_codes` table |
| **Layer 5: Session Token** | JWT from Supabase Auth | Expires after 15 min inactivity |
| **Layer 6: RLS Policies** | Row-level security in DB | Only see own company data |

### 5.2 Rate Limiting & Account Lockout

| Attempt | Lockout Duration | Admin Override? |
|---------|------------------|-----------------|
| 1-2 failures | None | N/A |
| 3-4 failures | 1 minute | Yes, via `admin_override_until` |
| 5-6 failures | 5 minutes | Yes, via `admin_override_until` |
| 7+ failures | 30 minutes | Yes, via `admin_override_until` |

**Admin override**: Set `rate_limits.admin_override_until` to future timestamp to allow immediate login.

### 5.3 One-Person-Per-Account Guarantee

**How it works:**
1. Email is the unique identifier (per user)
2. Enrollment code is specific to that email only
3. Only one auth session per user at a time (enforced by `unique(user_id)` in `user_sessions`)
4. Supabase Auth prevents multi-session by same user (unless explicitly allowed)

**Prevents:**
- User A logging in as User B (no auth code for User B's email)
- Multiple simultaneous logins by same user (session conflict)
- Session hijacking (JWT expires, session token validated)

### 5.4 Admin Audit Trail

**All admin actions logged in `audit_logs`:**
- Admin login/logout
- Balance changes
- Transaction approvals
- Rate limit overrides
- User enrollment code generation
- Account deletions
- Settings changes

**Example audit log entry:**
```json
{
  "actor_email": "tara.morgan@novaa.com",
  "action": "balance_change",
  "meta": {
    "account_id": "00000000-0000-0000-0000-000000000101",
    "old_balance": 15132500.00,
    "new_balance": 20000000.00,
    "reason": "Q2 capital injection"
  },
  "created_at": "2026-06-21T14:30:00Z"
}
```

---

## 6. Implementation Checklist

### Phase 1: Database Setup (Supabase) ✅ PARTIALLY DONE

- [x] Create schema.sql with all tables
- [ ] Deploy schema.sql to Supabase
- [ ] Deploy seed.sql to Supabase (sample data)
- [ ] Create RLS policies for each table
- [ ] Test RLS by logging in as different roles

### Phase 2: Client-Side Auth (React) 🔄 IN PROGRESS

- [x] Update Login.tsx with auth code field + rate limiting
- [x] Update AdminLogin.tsx with dual code sets
- [ ] Update AuthContext.tsx to fully validate sessions
- [ ] Add session token storage in user_sessions table
- [ ] Add session token validation on app load
- [ ] Add auto-logout after session expires
- [ ] Add route guards for all protected routes

### Phase 3: User Dashboard (React) ⏳ TODO

- [ ] Replace mocked accounts with real DB queries
- [ ] Replace mocked transactions with real DB queries
- [ ] Replace mocked cards with real DB queries
- [ ] Replace mocked notifications with real DB queries
- [ ] Implement real transfer + bill pay (update DB)

### Phase 4: Admin Dashboard (React) ⏳ TODO

- [ ] User management (list, revoke, reset)
- [ ] Enrollment code generation UI
- [ ] Account management (edit balance, currency)
- [ ] Transaction management (approve, hold, cancel, inject)
- [ ] Rate limit management (clear lockout, admin override)
- [ ] Audit log viewer + filter
- [ ] Company settings management

### Phase 5: Security Hardening ⏳ TODO

- [ ] Enable HTTPS only
- [ ] Set secure cookies (httpOnly, sameSite)
- [ ] Add CSRF protection tokens
- [ ] Rate limit API endpoints
- [ ] Monitor for suspicious patterns (login storms, etc.)
- [ ] Implement password complexity rules
- [ ] Add account recovery flow (forgot password)

### Phase 6: Monitoring & Ops ⏳ TODO

- [ ] Set up alert for 7+ failed login attempts
- [ ] Set up alert for suspicious admin actions
- [ ] Log all sensitive operations
- [ ] Set up metrics: login attempts, session creation, errors
- [ ] Create runbook for "user locked out" scenario

---

## 7. Known Limitations & Future Work

### 7.1 Current Limitations

1. **Admin code rotation**: Currently manual (via seed.sql). Should be automated trigger + scheduled function.
2. **Session limit (max 10 users)**: Enforced at app logic level. Should be enforced at DB trigger level.
3. **Enrollment code generation**: Admin must manually create. Could have self-service with email verification.
4. **Account recovery**: No "forgot password" flow yet.
5. **2FA for users**: Currently auth code + password. Could add SMS/TOTP.

### 7.2 Future Enhancements

- [ ] Implement "send login approval link" (magic link sent to user email)
- [ ] Implement "send password reset link"
- [ ] Implement "challenge-response" for suspicious logins (IP change, new device)
- [ ] Implement user-facing audit log ("I changed my password on 2026-06-21")
- [ ] Implement biometric login (fingerprint/face recognition)
- [ ] Implement single sign-on (SSO) for admin
- [ ] Implement API keys for admin integrations

---

## 8. Deployment Steps

### Step 1: Deploy Supabase Schema & Seed

```bash
# 1. Go to Supabase Dashboard > SQL Editor
# 2. Copy all content from supabase/schema.sql
# 3. Paste and run (takes ~10 seconds)
# 4. Copy all content from supabase/seed.sql
# 5. Paste and run (takes ~5 seconds)

# Verify:
# - Run: SELECT table_name FROM information_schema.tables WHERE table_schema='public';
# - Should see 13 tables
```

### Step 2: Create RLS Policies

```bash
# 1. Go to Supabase Dashboard > Authentication > Policies
# 2. For each table (accounts, transactions, cards, notifications, etc.)
# 3. Enable RLS
# 4. Create policies as defined in Section 3.2
```

### Step 3: Deploy Updated Frontend Code

```bash
# 1. Commit all changes to feature/westgate-rebrand
# 2. Push to repo
# 3. Deploy to production (Vercel, Netlify, etc.)
# 4. Verify routes:
#    - /login → shows email + password + auth code fields
#    - /admin/login → shows username + password + 3 code fields
#    - /dashboard → redirects if not logged in
#    - /admin → redirects if not admin
```

### Step 4: Create Test Users

```bash
# For each test company:
# 1. Create Supabase Auth users (via Supabase Dashboard > Users)
# 2. Create company_users entries linking auth user to company
# 3. Create user_auth_codes for each user (enrollment codes)
# 4. Create admin_users entry for admin
# 5. Create admin_auth_codes with two sets
# 6. Create sample accounts, transactions, cards
```

### Step 5: Run End-to-End Tests

```bash
# Test flows:
# 1. User login (email + password + valid auth code)
# 2. User login failure (invalid auth code)
# 3. User rate limiting (5 failed attempts)
# 4. Admin override of rate limit
# 5. Admin login (username + password + codes)
# 6. Admin generates enrollment code
# 7. Admin injects balance change
# 8. User sees updated balance
# 9. Audit log shows admin action
```

---

## 9. FAQ

**Q: What if a user loses their enrollment code?**
A: Admin must generate a new code from the admin dashboard and share it with the user.

**Q: What if an admin forgets their security codes?**
A: Platform owner must manually update `admin_auth_codes` table with new codes (or revoke+recreate admin account).

**Q: Can a user be logged in on multiple devices simultaneously?**
A: Currently yes (if `user_sessions` is not enforced as single-session). To restrict to 1 session: add unique constraint or check before creating new session.

**Q: How long are sessions valid?**
A: 15 minutes of inactivity (Supabase Auth default). Can be increased in Supabase settings if needed.

**Q: Can admins see user passwords?**
A: No. Passwords are hashed by Supabase Auth and never stored in plain text.

**Q: What happens if a user's email changes?**
A: Their login email must also change. All references in `company_users`, `user_auth_codes`, `rate_limits` must be updated. This should be a manual admin process for now.

**Q: How are failed login attempts tracked?**
A: In `rate_limits` table by email. Each failed attempt increments `failed_attempts`, and `lockout_until` is set based on attempt count.

---

## 10. Conclusion

Novaa's auth system is designed to be:
- **Secure**: Multi-layer authentication, RLS, audit logging
- **Flexible**: Admin can override rate limits and manage users
- **Auditable**: All actions logged for compliance
- **User-friendly**: Email-only for users, clear error messages

The implementation is **60% complete** as of June 2026:
- ✅ Login pages with auth codes
- ✅ Admin login with dual codes
- ✅ Supabase schema + seed data prepared
- ⏳ RLS policies (not yet deployed)
- ⏳ Admin dashboard (UI exists, needs real data)
- ⏳ Session management (partial)
- ⏳ Full audit logging (partial)

Next priority: Deploy schema to Supabase, then wire admin and user dashboards to use real data instead of mocks.
