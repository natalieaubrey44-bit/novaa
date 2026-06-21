import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="w-full max-w-md p-8 bg-slate-800/80 rounded-2xl border border-white/6">
        <h2 className="text-2xl font-bold mb-4">Administrator Login</h2>
        {error && <div className="p-3 bg-red-800 text-red-200 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-300 mb-2">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={16} /></span>
              <input value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2 rounded bg-slate-700 border border-white/8" placeholder="admin@novaa.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-300 mb-2">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={16} /></span>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-3 py-2 rounded bg-slate-700 border border-white/8" placeholder="Password" />
            </div>
          </div>
          <button type="submit" className="w-full py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold flex items-center justify-center gap-2">
            <ShieldCheck /> Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
