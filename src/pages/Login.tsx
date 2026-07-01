import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, User, Landmark, HelpCircle, Check, AlertCircle, UserCheck, CheckCircle, Loader } from 'lucide-react';
import NovaaLogo from '../components/NovaaLogo';
import { imageSources } from '../data/imageSources';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [rateLimitMessage, setRateLimitMessage] = useState('');

  // Auto redirect if already logged in
  if (isLoggedIn) {
    setTimeout(() => {
      navigate('/dashboard');
    }, 100);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!authCode) {
      setError('Auth code is required. Contact your admin for an enrollment code.');
      return;
    }
    setError('');
    setSuccess('');
    setRateLimitMessage('');
    setIsLoading(true);

    try {
      // Check if user is rate-limited
      const { data: rateLimit } = await supabase
        .from('rate_limits')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      const now = new Date();

      if (rateLimit) {
        const lockoutUntil = rateLimit.lockout_until ? new Date(rateLimit.lockout_until) : null;
        const adminOverrideUntil = rateLimit.admin_override_until ? new Date(rateLimit.admin_override_until) : null;

        if (adminOverrideUntil && now < adminOverrideUntil) {
          setRateLimitMessage('✓ Admin override active - proceeding with login.');
        } else if (lockoutUntil && now < lockoutUntil) {
          const remainingMinutes = Math.ceil((lockoutUntil.getTime() - now.getTime()) / 60000);
          setError(`Too many failed attempts. Please try again in ${remainingMinutes} minute(s). Contact admin for immediate access.`);
          setIsLoading(false);
          return;
        }
      }

      // Verify auth code
      const { data: userAuthCode, error: codeError } = await supabase
        .from('user_auth_codes')
        .select('*')
        .eq('code', authCode)
        .eq('email', email)
        .maybeSingle();

      if (!userAuthCode || codeError) {
        setError('Invalid auth code for this email address.');
        setIsLoading(false);
        return;
      }

      if (userAuthCode.is_used) {
        setError('This auth code has already been used.');
        setIsLoading(false);
        return;
      }

      const codeExpires = new Date(userAuthCode.expires_at);
      if (now > codeExpires) {
        setError('Auth code has expired. Contact admin for a new code.');
        setIsLoading(false);
        return;
      }

      // Attempt Supabase auth
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        // Record failed attempt
        const { data: existingRateLimit } = await supabase
          .from('rate_limits')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (existingRateLimit) {
          const newAttempts = existingRateLimit.failed_attempts + 1;
          let lockoutUntil = null;

          if (newAttempts >= 3 && newAttempts < 5) {
            lockoutUntil = new Date(Date.now() + 60000).toISOString(); // 1 minute
          } else if (newAttempts >= 5 && newAttempts < 7) {
            lockoutUntil = new Date(Date.now() + 300000).toISOString(); // 5 minutes
          } else if (newAttempts >= 7) {
            lockoutUntil = new Date(Date.now() + 1800000).toISOString(); // 30 minutes
          }

          await supabase
            .from('rate_limits')
            .update({ failed_attempts: newAttempts, last_failed_at: now.toISOString(), lockout_until: lockoutUntil })
            .eq('email', email);
        } else {
          await supabase.from('rate_limits').insert([{ email, failed_attempts: 1, last_failed_at: now.toISOString() }]);
        }

        setError(authError.message || 'Login failed');
        setIsLoading(false);
        return;
      }

      // Mark auth code as used
      await supabase
        .from('user_auth_codes')
        .update({ is_used: true })
        .eq('id', userAuthCode.id);

      // Reset rate limits on success
      await supabase.from('rate_limits').update({ failed_attempts: 0, lockout_until: null }).eq('email', email);

      // Sign-in successful
      setSuccess('✓ Login successful! Redirecting...');
      await login(email, name || email.split('@')[0], 'user', password);
      setIsLoading(false);
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (demoType: 'alex' | 'admin') => {
    setError('');
    setSuccess('');
    setRateLimitMessage('');
    setIsLoading(true);
    setTimeout(() => {
      if (demoType === 'alex') {
        setEmail('alex.carter@novaa.test');
        setName('Alex Carter');
        setAuthCode('USER-ABC123XYZ');
        login('alex.carter@novaa.test', 'Alex Carter');
        navigate('/dashboard');
      } else if (demoType === 'marcus') {
        setEmail('marcus.fredebel@novaa.test');
        setName('Marcus Fredebel');
        setAuthCode('USER-DEF456UVW');
        login('marcus.fredebel@novaa.test', 'Marcus Fredebel');
        navigate('/dashboard');
      } else {
        setEmail('admin@novaa.com');
        setName('Nova Admin');
        setAuthCode('');
        login('admin@novaa.com', 'Nova Admin', 'admin');
        navigate('/admin/login');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-brand-dark overflow-hidden pt-20">
      
      {/* Visual / Marketing Side (Left Column) */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 bg-brand-navy text-white overflow-hidden border-r border-brand-navy">
        <div className="absolute inset-0 z-0">
          <img 
            src={imageSources.loginHero} 
            alt="Novaa Security Base" 
            className="w-full h-full object-cover mix-blend-overlay opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-brand-navy/90 border-r border-brand-accent/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <NovaaLogo className="text-3xl text-white" iconSize={36} />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-accent bg-brand-accent/10 rounded-full border border-brand-accent/20">
              Military-Grade Security
            </span>
            <h2 className="text-4xl lg:text-5xl font-display font-medium leading-tight">
              The Intelligent Way To Management Wealth.
            </h2>
            <p className="text-brand-light/70 text-base leading-relaxed">
              Experience safe, highly visual financial dashboards monitored with real-time multi-factor checks and encrypted tokenizations.
            </p>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <ShieldCheck size={28} className="text-brand-accent" />
            <div className="text-xs">
              <p className="font-semibold text-white">256-bit SSL Absolute Encryption</p>
              <p className="text-brand-light/60">Your access token expires automatically after {SESSION_TTL_MINUTES} minutes of inactivity.</p>
            </div>
          </div>
          <p className="text-xs text-brand-light/40">
            © 2026 Novaa Inc. All rights reserved. Member FDIC. Equal Housing Lender.
          </p>
        </div>
      </div>

      {/* Form Side (Right Column) */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center px-4 sm:px-12 lg:px-20 py-12 bg-brand-dark/95 relative">

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile logo and header */}
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start items-center mb-6 lg:hidden">
              <NovaaLogo className="text-3xl text-white" iconSize={36} />
            </div>

            <h1 className="text-3xl font-display font-bold text-white tracking-tight">
              Access Private Banking
            </h1>
            <p className="text-sm text-brand-light/60 mt-2">
              Please verify your credentials first, then confirm your enrollment code.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-950/40 border border-red-500/30 text-red-200 rounded-xl text-sm flex items-center gap-3"
            >
              <AlertCircle size={18} className="text-red-400 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-950/40 border border-green-500/30 text-green-200 rounded-xl text-sm flex items-center gap-3"
            >
              <CheckCircle size={18} className="text-green-400 shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          {rateLimitMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-blue-950/40 border border-blue-500/30 text-blue-200 rounded-xl text-sm flex items-center gap-3"
            >
              <CheckCircle size={18} className="text-blue-400 shrink-0" />
              <span>{rateLimitMessage}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name-input" className="block text-xs font-semibold text-white/80 uppercase tracking-widest mb-2">
                User Name (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                  <User size={18} />
                </span>
                <input
                  id="name-input"
                  type="text"
                  placeholder="User 1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-brand-secondary/70 border border-white/15 text-white placeholder-white/50 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/20 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email-input" className="block text-xs font-semibold text-white/80 uppercase tracking-widest mb-2">
                Secure Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                  <Mail size={18} />
                </span>
                <input
                  id="email-input"
                  type="email"
                  placeholder="user1@novaa.test"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-brand-secondary/70 border border-white/15 text-white placeholder-white/50 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/20 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password-input" className="block text-xs font-semibold text-white/80 uppercase tracking-widest mb-2">
                Authentication Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                  <Lock size={18} />
                </span>
                <input
                  id="password-input"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-brand-secondary/70 border border-white/15 text-white placeholder-white/50 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/20 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="authcode-input" className="block text-xs font-semibold text-white/80 uppercase tracking-widest mb-2">
                Enrollment Auth Code
              </label>
              <input
                id="authcode-input"
                type="text"
                placeholder="USER-ABC123XYZ"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3.5 rounded-xl bg-brand-secondary/70 border border-white/15 text-white placeholder-white/50 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/20 transition-all text-sm"
                required
              />
              <p className="text-xs text-brand-light/50 mt-1.5">Required. Contact your admin for an enrollment code. Codes expire after 7 days.</p>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-brand-light/70 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="rounded border-brand-secondary bg-brand-secondary/40 text-brand-accent focus:ring-brand-accent/50 h-4 w-4"
                />
                Remember security credentials
              </label>
              <a href="#" className="text-brand-accent hover:underline font-medium">Reset Secure PIN?</a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-brand-accent text-brand-primary dark:text-white transition-colors font-bold hover:bg-brand-accent/90 transition-all shrink-0 shadow-lg shadow-brand-accent/15 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Securing Environment...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={20} />
                  <span>{step === 'credentials' ? 'Verify Credentials' : 'Authenticate Secure Login'}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Sandbox Profiles Header */}
          <div className="relative flex py-2 items-center">
            <div className="grow border-t border-brand-secondary/40"></div>
            <span className="shrink-0 mx-4 text-[10px] font-semibold tracking-widest uppercase text-brand-light/40">
              OR USE THE STARTER DEMO ACCESS
            </span>
            <div className="grow border-t border-brand-secondary/40"></div>
          </div>

          {/* Grid of demo profile cards */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <button
              onClick={() => handleQuickDemo('alex')}
              className="p-4 rounded-2xl bg-brand-primary/40 text-left border border-brand-secondary/60 hover:bg-brand-primary/80 hover:border-brand-accent/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-white text-sm group-hover:text-brand-accent transition-colors">User 1</p>
                <span className="text-[10px] bg-brand-accent/10 border border-brand-accent/20 text-brand-accent px-1.5 py-0.5 rounded font-mono">
                  Checking Base
                </span>
              </div>
              <p className="text-xs text-brand-light/60">Email: alex.carter@novaa.test</p>
              <p className="text-xs text-brand-light/40 mt-1 flex items-center gap-1">
                <Check size={12} className="text-green-400" /> Code: USER-ABC123XYZ
              </p>
            </button>

            <button
              onClick={() => handleQuickDemo('marcus')}
              className="p-4 rounded-2xl bg-brand-primary/40 text-left border border-brand-secondary/60 hover:bg-brand-primary/80 hover:border-brand-accent/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-white text-sm group-hover:text-brand-accent transition-colors">Marcus Fredebel</p>
                <span className="text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded font-mono">
                  Investor
                </span>
              </div>
              <p className="text-xs text-brand-light/60">Email: marcus.fredebel@novaa.test</p>
              <p className="text-xs text-brand-light/40 mt-1 flex items-center gap-1">
                <Check size={12} className="text-green-400" /> Code: USER-DEF456UVW
              </p>
            </button>

            <button
              onClick={() => handleQuickDemo('admin')}
              className="p-4 rounded-2xl bg-slate-900/80 text-left border border-white/10 hover:bg-slate-800 hover:border-brand-accent/40 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-white text-sm group-hover:text-brand-accent transition-colors">Global Admin</p>
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                  Role: Admin
                </span>
              </div>
              <p className="text-xs text-brand-light/60">Email: tara.morgan@novaa.com</p>
              <p className="text-xs text-brand-light/40 mt-1 flex items-center gap-1">
                <Check size={12} className="text-green-400" /> Admin route enabled
              </p>
            </button>
          </div>

          <div className="pt-2 text-center text-xs text-brand-light/40 flex items-center justify-center gap-1.5">
            <HelpCircle size={14} />
            <span>Need help accessing your private key?</span>
            <a href="#" className="underline hover:text-white">Call Support</a>
          </div>

        </motion.div>
      </div>

    </div>
  );
}
