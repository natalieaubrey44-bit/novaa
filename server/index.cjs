const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cookieParser());

const AUDIT_FILE = path.join(__dirname, 'audit', 'admin_audit_log.json');
try { fs.mkdirSync(path.join(__dirname, 'audit'), { recursive: true }); } catch (e) {}
if (!fs.existsSync(AUDIT_FILE)) fs.writeFileSync(AUDIT_FILE, '[]');

const JWT_USER_SECRET = process.env.JWT_USER_SECRET || 'user-secret-demo';
const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET || 'admin-secret-demo';

const users = [
  { email: 'alex.carter@nova.com', name: 'Alex Carter', passwordHash: bcrypt.hashSync('password', 8), role: 'user' },
  { email: 'admin@novaa.com', name: 'Nova Admin', passwordHash: bcrypt.hashSync('adminpass', 8), role: 'admin' },
];

const adminFailed = {}; // email -> { count, lockedUntil }
const refreshStore = {}; // refreshToken -> email

const userLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false });
const adminLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false });

function auditAdmin(action, details) {
  try {
    const raw = fs.readFileSync(AUDIT_FILE, 'utf8');
    const arr = JSON.parse(raw || '[]');
    arr.unshift({ id: `a-${Date.now()}`, action, details, time: new Date().toISOString() });
    fs.writeFileSync(AUDIT_FILE, JSON.stringify(arr, null, 2));
  } catch (e) { console.error('audit write failed', e); }
}

app.get('/api/auth/csrf/:flow', (req, res) => {
  const { flow } = req.params;
  const token = `csrf-${flow}-${Math.random().toString(36).slice(2,10)}`;
  const cookieName = flow === 'admin' ? 'csrf_admin' : 'csrf_user';
  res.cookie(cookieName, token, { httpOnly: false });
  res.json({ csrf: token });
});

app.post('/api/auth/user/login', userLimiter, (req, res) => {
  const { email, password, csrf } = req.body || {};
  // CSRF double-submit check (demo)
  if (!req.cookies.csrf_user || csrf !== req.cookies.csrf_user) return res.status(400).json({ error: 'Invalid CSRF' });

  const u = users.find(x => x.email === email && x.role === 'user');
  if (!u) return res.status(401).json({ error: 'Invalid credentials' });
  if (!bcrypt.compareSync(password || '', u.passwordHash)) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ email: u.email, name: u.name, role: 'user' }, JWT_USER_SECRET, { expiresIn: '15m' });
  res.cookie('token_user', token, { httpOnly: true, secure: false });
  res.json({ user: { email: u.email, name: u.name, role: 'user' } });
});

app.post('/api/auth/admin/login', adminLimiter, (req, res) => {
  const { email, password, csrf } = req.body || {};
  if (!req.cookies.csrf_admin || csrf !== req.cookies.csrf_admin) {
    auditAdmin('admin_login_failed_csrf', { email });
    return res.status(400).json({ error: 'Invalid CSRF' });
  }

  const u = users.find(x => x.email === email && x.role === 'admin');
  if (!u) {
    auditAdmin('admin_login_failed', { email, reason: 'no_user' });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const state = adminFailed[email] || { count: 0, lockedUntil: 0 };
  if (state.lockedUntil && Date.now() < state.lockedUntil) return res.status(423).json({ error: 'Account locked' });

  if (!bcrypt.compareSync(password || '', u.passwordHash)) {
    state.count = (state.count || 0) + 1;
    if (state.count >= 5) state.lockedUntil = Date.now() + 15 * 60 * 1000; // lock 15m
    adminFailed[email] = state;
    auditAdmin('admin_login_failed', { email, reason: 'bad_password', attempts: state.count });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // success: reset failed
  adminFailed[email] = { count: 0, lockedUntil: 0 };
  const token = jwt.sign({ email: u.email, name: u.name, role: 'admin' }, JWT_ADMIN_SECRET, { expiresIn: '15m' });
  // refresh token rotation (demo): store server-side and set cookie
  const refresh = Math.random().toString(36).slice(2) + '.' + Date.now();
  refreshStore[refresh] = { email: u.email, created: Date.now() };
  res.cookie('token_admin', token, { httpOnly: true, secure: false });
  res.cookie('refresh_admin', refresh, { httpOnly: true, secure: false });
  auditAdmin('admin_login_success', { email });
  res.json({ user: { email: u.email, name: u.name, role: 'admin' } });
});

app.post('/api/auth/admin/refresh', (req, res) => {
  const r = req.cookies.refresh_admin;
  if (!r || !refreshStore[r]) return res.status(401).json({ error: 'Invalid refresh' });
  const rec = refreshStore[r];
  // rotate
  delete refreshStore[r];
  const newRefresh = Math.random().toString(36).slice(2) + '.' + Date.now();
  refreshStore[newRefresh] = { email: rec.email, created: Date.now() };
  const token = jwt.sign({ email: rec.email, role: 'admin' }, JWT_ADMIN_SECRET, { expiresIn: '15m' });
  res.cookie('token_admin', token, { httpOnly: true, secure: false });
  res.cookie('refresh_admin', newRefresh, { httpOnly: true, secure: false });
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
  try {
    const tAdmin = req.cookies.token_admin;
    if (tAdmin) {
      const decoded = jwt.verify(tAdmin, JWT_ADMIN_SECRET);
      return res.json({ user: { email: decoded.email, name: decoded.name || 'Admin', role: 'admin' } });
    }
  } catch (e) {}
  try {
    const tUser = req.cookies.token_user;
    if (tUser) {
      const decoded = jwt.verify(tUser, JWT_USER_SECRET);
      return res.json({ user: { email: decoded.email, name: decoded.name || 'User', role: 'user' } });
    }
  } catch (e) {}
  return res.json({ user: null });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Dev auth server listening on', port));
