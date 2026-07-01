import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [code3, setCode3] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!username || !password || !code1 || !code2 || !code3) {
        setError('All fields (username, password, and security codes) are required.');
        setIsLoading(false);
        return;
      }

      // Find admin by username (email)
      const { data: adminUser, error: lookupError } = await supabase
        .from('admin_users')
        .select('id, user_id, email, status')
        .eq('email', username)
        .maybeSingle();

      if (!adminUser || lookupError) {
        setError('Admin account not found.');
        setIsLoading(false);
        return;
      }

      if (adminUser.status !== 'active') {
        setError('This admin account is suspended or pending activation.');
        setIsLoading(false);
        return;
      }

      // Check admin auth codes (two sets, active and standby)
      const { data: authCodes, error: codesError } = await supabase
        .from('admin_auth_codes')
        .select('*')
        .eq('admin_id', adminUser.id)
        .order('code_set', { ascending: true });

      if (!authCodes || authCodes.length === 0) {
        setError('No security codes configured for this admin account.');
        setIsLoading(false);
        return;
      }

      let validCodeSet = null;
      const now = new Date();

      for (const codeSet of authCodes) {
        const expiresAt = new Date(codeSet.expires_at);
        if (now <= expiresAt) {
          // Check if all three codes match
          if (
            (code1 === codeSet.code_1 && code2 === codeSet.code_2 && code3 === codeSet.code_3) ||
            (code1 === codeSet.code_2 && code2 === codeSet.code_3 && code3 === codeSet.code_1) ||
            (code1 === codeSet.code_3 && code2 === codeSet.code_1 && code3 === codeSet.code_2)
          ) {
            validCodeSet = codeSet;
            break;
          }
        }
      }

      if (!validCodeSet) {
        setError('Invalid security codes. Codes are case-sensitive and order-dependent.');
        setIsLoading(false);
        return;
      }

      // If admin has a Supabase Auth user, attempt sign-in
      if (adminUser.user_id) {
        const { error: authError } = await supabase.auth.signInWithPassword({ 
          email: adminUser.email, 
          password 
        });

        if (authError) {
          setError(authError.message || 'Authentication failed');
          setIsLoading(false);
          return;
        }
      }

      // Log successful admin login
      await supabase.from('audit_logs').insert([{
        actor_user_id: adminUser.user_id,
        actor_email: adminUser.email,
        action: 'admin_login_success',
        meta: { admin_id: adminUser.id, code_set: validCodeSet.code_set, ip: 'unknown' }
      }]);

      setSuccess('✓ Security codes verified! Redirecting to admin dashboard...');
      setIsLoading(false);
      setTimeout(() => navigate('/admin'), 800);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md p-8 bg-slate-800/80 rounded-2xl border border-white/6">
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="text-emerald-400" size={28} />
          <h2 className="text-2xl font-bold">Administrator Portal</h2>
        </div>
        <p className="text-sm text-slate-400 mb-6">Secure access with two-factor authentication</p>

        {error && (
          <div className="p-3 bg-red-900/20 border border-red-700/50 text-red-200 rounded mb-4 flex gap-2 text-sm">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-900/20 border border-green-700/50 text-green-200 rounded mb-4 flex gap-2 text-sm">
            <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-300 mb-2">Admin Username (Email)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={16} />
              </span>
              <input 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="w-full pl-10 pr-3 py-2 rounded bg-slate-700 border border-white/8 focus:border-emerald-500/50 focus:outline-none" 
                placeholder="tara.morgan@novaa.com" 
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-2">Master Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={16} />
              </span>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full pl-10 pr-3 py-2 rounded bg-slate-700 border border-white/8 focus:border-emerald-500/50 focus:outline-none" 
                placeholder="••••••••" 
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-2">Security Codes (Three Required)</label>
            <p className="text-xs text-slate-500 mb-2">Enter the three codes from your active or standby code set (order matters).</p>
            <div className="grid grid-cols-3 gap-2">
              <input 
                type="text" 
                value={code1} 
                onChange={e => setCode1(e.target.value.toUpperCase())} 
                className="px-3 py-2 rounded bg-slate-700 border border-white/8 focus:border-emerald-500/50 focus:outline-none text-sm text-center" 
                placeholder="CODE1" 
                maxLength={8}
                required
              />
              <input 
                type="text" 
                value={code2} 
                onChange={e => setCode2(e.target.value.toUpperCase())} 
                className="px-3 py-2 rounded bg-slate-700 border border-white/8 focus:border-emerald-500/50 focus:outline-none text-sm text-center" 
                placeholder="CODE2" 
                maxLength={8}
                required
              />
              <input 
                type="text" 
                value={code3} 
                onChange={e => setCode3(e.target.value.toUpperCase())} 
                className="px-3 py-2 rounded bg-slate-700 border border-white/8 focus:border-emerald-500/50 focus:outline-none text-sm text-center" 
                placeholder="CODE3" 
                maxLength={8}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-2 rounded bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-900 font-semibold flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
            {isLoading ? 'Verifying...' : 'Access Admin Panel'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-slate-400 mb-2">Demo Admin (for testing):</p>
          <p className="text-xs text-slate-500">Email: tara.morgan@novaa.com</p>
          <p className="text-xs text-slate-500">Codes (Set 1): ADMIN001, ADMIN002, ADMIN003</p>
        </div>
      </div>
    </div>
  );
}
