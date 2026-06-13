import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, User, Landmark, HelpCircle, Check, AlertCircle, UserCheck } from 'lucide-react';
import NovaaLogo from '../components/NovaaLogo';

export default function Login() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Auto redirect if already logged in
  if (isLoggedIn) {
    setTimeout(() => {
      navigate('/dashboard');
    }, 100);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setIsLoading(true);

    // Simulate authentic MFA verification bank delay
    setTimeout(() => {
      login(email, name || 'Alex Carter');
      setIsLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  const handleQuickDemo = (demoType: 'alex' | 'marcus') => {
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      if (demoType === 'alex') {
        setEmail('alex.carter@nova.com');
        setName('Alex Carter');
        login('alex.carter@nova.com', 'Alex Carter');
      } else {
        setEmail('mfredebel@gmail.com');
        setName('Marcus Fredebel');
        login('mfredebel@gmail.com', 'Marcus Fredebel');
      }
      setIsLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-brand-dark overflow-hidden pt-20">
      
      {/* Visual / Marketing Side (Left Column) */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 bg-brand-navy text-white overflow-hidden border-r border-brand-navy">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop" 
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
              <p className="text-brand-light/60">Your access token expires automatically after 15 mins of inactivity.</p>
            </div>
          </div>
          <p className="text-xs text-brand-light/40">
            © 2026 Novaa Inc. All rights reserved. Member FDIC. Equal Housing Lender.
          </p>
        </div>
      </div>

      {/* Form Side (Right Column) */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center px-4 sm:px-12 lg:px-20 py-12 bg-brand-dark/95 relative">
        <div className="absolute top-24 right-12 text-xs text-brand-accent flex items-center gap-2 bg-brand-primary/40 px-3 py-1.5 rounded-full border border-brand-accent/20">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
          </span>
          NovaaSecure Server Online
        </div>

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
              Please declare your secure key details or access via demo profile.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-200 rounded-xl text-sm flex items-center gap-3">
              <AlertCircle size={18} className="text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name-input" className="block text-xs font-semibold text-brand-light/80 uppercase tracking-widest mb-2">
                User Name (Optional, defaults to Alex)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-light/40">
                  <User size={18} />
                </span>
                <input
                  id="name-input"
                  type="text"
                  placeholder="Alex Carter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-brand-secondary/40 border border-brand-secondary/60 text-white placeholder-brand-light/30 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/20 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email-input" className="block text-xs font-semibold text-brand-light/80 uppercase tracking-widest mb-2">
                Secure Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-light/40">
                  <Mail size={18} />
                </span>
                <input
                  id="email-input"
                  type="email"
                  placeholder="alex.carter@nova.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-brand-secondary/40 border border-brand-secondary/60 text-white placeholder-brand-light/30 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/20 transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password-input" className="block text-xs font-semibold text-brand-light/80 uppercase tracking-widest mb-2">
                Authentication Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-light/40">
                  <Lock size={18} />
                </span>
                <input
                  id="password-input"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-brand-secondary/40 border border-brand-secondary/60 text-white placeholder-brand-light/30 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/20 transition-all text-sm"
                />
              </div>
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
                  <span>Authenticate Secure Login</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Sandbox Profiles Header */}
          <div className="relative flex py-2 items-center">
            <div className="grow border-t border-brand-secondary/40"></div>
            <span className="shrink-0 mx-4 text-[10px] font-semibold tracking-widest uppercase text-brand-light/40">
              OR TEST IMMEDIATELY with demo profiles
            </span>
            <div className="grow border-t border-brand-secondary/40"></div>
          </div>

          {/* Grid of demo profile cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleQuickDemo('alex')}
              className="p-4 rounded-2xl bg-brand-primary/40 text-left border border-brand-secondary/60 hover:bg-brand-primary/80 hover:border-brand-accent/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-white text-sm group-hover:text-brand-accent transition-colors">Alex Carter</p>
                <span className="text-[10px] bg-brand-accent/10 border border-brand-accent/20 text-brand-accent px-1.5 py-0.5 rounded font-mono">
                  Checking Base
                </span>
              </div>
              <p className="text-xs text-brand-light/60">Email: alex.carter@nova.com</p>
              <p className="text-xs text-brand-light/40 mt-1 flex items-center gap-1">
                <Check size={12} className="text-green-400" /> Presets loaded
              </p>
            </button>

            <button
              onClick={() => handleQuickDemo('marcus')}
              className="p-4 rounded-2xl bg-brand-primary/40 text-left border border-brand-secondary/60 hover:bg-brand-primary/80 hover:border-brand-accent/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-white text-sm group-hover:text-brand-accent transition-colors">Marcus Fredebel</p>
                <span className="text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded font-mono">
                  Gmail Core
                </span>
              </div>
              <p className="text-xs text-brand-light/60">Email: mfredebel@gmail.com</p>
              <p className="text-xs text-brand-light/40 mt-1 flex items-center gap-1">
                <Check size={12} className="text-green-400" /> Presets loaded
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
