const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/api/auth/csrf/:flow', (req, res) => {
  const { flow } = req.params;
  res.json({ csrf: `demo-csrf-${flow}` });
});

app.post('/api/auth/user/login', (req, res) => {
  const { email } = req.body || {};
  res.cookie('token_user', 'demo-user-token', { httpOnly: true });
  res.json({ user: { email: email || 'demo@user', name: 'Demo User', role: 'user' } });
});

app.post('/api/auth/admin/login', (req, res) => {
  const { email } = req.body || {};
  res.cookie('token_admin', 'demo-admin-token', { httpOnly: true });
  res.json({ user: { email: email || 'admin@novaa.com', name: 'Demo Admin', role: 'admin' } });
});

app.get('/api/auth/me', (req, res) => {
  if (req.cookies.token_admin) return res.json({ user: { email: 'admin@novaa.com', name: 'Demo Admin', role: 'admin' } });
  if (req.cookies.token_user) return res.json({ user: { email: 'user@novaa.com', name: 'Demo User', role: 'user' } });
  return res.json({ user: null });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Dev auth server listening on', port));
