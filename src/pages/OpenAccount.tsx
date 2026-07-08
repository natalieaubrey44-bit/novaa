import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, User, Landmark, ChevronLeft, ChevronRight } from 'lucide-react';
import NovaaLogo from '../components/NovaaLogo';
import { imageSources } from '../data/imageSources';

const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany'];
const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
const accountTypes = ['Checking', 'Savings', 'Credit', 'Investment'];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
const passwordRules = {
  minLength: 8,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  symbol: /[^A-Za-z0-9]/,
};

export default function OpenAccount() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    username: '',
    email: '',
    phone: '',
    country: '',
    currency: '',
    accountType: '',
    transactionPin: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  const stepTitles = ['Personal', 'Contact', 'Account', 'Security'];

  const firstName = form.firstName.trim();
  const lastName = form.lastName.trim();
  const fullName = `${firstName} ${lastName}`.trim();
  const suggestedEmail = useMemo(() => {
    const normalized = `${firstName.toLowerCase() || 'john'}.${lastName.toLowerCase() || 'doe'}`.replace(/[^a-z0-9.]/g, '');
    return `${normalized || 'john.doe'}@example.com`;
  }, [firstName, lastName]);
  const suggestedUsername = useMemo(() => {
    const normalized = `${firstName.toLowerCase() || 'john'}${lastName.toLowerCase() || 'smith'}`.replace(/[^a-z0-9]/g, '');
    return `@${normalized || 'johnsmith123'}`;
  }, [firstName, lastName]);

  const getInputState = (field: string) => {
    if (errors[field]) return 'invalid';
    if (isValidField(field)) return 'valid';
    return '';
  };

  const isValidField = (field: string) => {
    const v = (form as any)[field];
    switch (field) {
      case 'firstName':
      case 'lastName':
        return typeof v === 'string' && v.trim().length > 0;
      case 'username':
        return typeof v === 'string' && v.trim().length >= 3;
      case 'email':
        return emailRegex.test(v);
      case 'phone':
        return phoneRegex.test(v);
      case 'country':
        return !!v;
      case 'currency':
        return !!v;
      case 'accountType':
        return !!v;
      case 'transactionPin':
        return /^[0-9]{4}$/.test(v);
      case 'password':
        return (
          typeof v === 'string' &&
          v.length >= passwordRules.minLength &&
          passwordRules.uppercase.test(v) &&
          passwordRules.number.test(v) &&
          passwordRules.symbol.test(v)
        );
      case 'confirmPassword':
        return form.password && v === form.password;
      default:
        return false;
    }
  };

  const passwordStrength = () => {
    const p = form.password || '';
    let score = 0;
    if (p.length >= passwordRules.minLength) score++;
    if (passwordRules.uppercase.test(p)) score++;
    if (passwordRules.number.test(p)) score++;
    if (passwordRules.symbol.test(p)) score++;
    if (passwordRules.lowercase.test(p)) score++;
    return Math.min(5, score);
  };

  const validateStep = () => {
    const nextErrors: Record<string, string> = {};

    if (activeStep === 0) {
      if (!firstName) nextErrors.firstName = 'First name is required.';
      if (!lastName) nextErrors.lastName = 'Last name is required.';
      if (!form.username) nextErrors.username = 'Username is required.';
    }

    if (activeStep === 1) {
      if (!emailRegex.test(form.email)) nextErrors.email = 'Enter a valid email address.';
      if (!phoneRegex.test(form.phone)) nextErrors.phone = 'Enter a valid phone number.';
      if (!form.country) nextErrors.country = 'Please select a country.';
    }

    if (activeStep === 2) {
      if (!form.currency) nextErrors.currency = 'Please select a currency.';
      if (!form.accountType) nextErrors.accountType = 'Please choose an account type.';
      if (!/^[0-9]{4}$/.test(form.transactionPin)) nextErrors.transactionPin = 'Enter a 4-digit PIN.';
    }

    if (activeStep === 3) {
      if (!form.password) nextErrors.password = 'Create a password.';
      if (form.password.length < passwordRules.minLength) nextErrors.password = 'Password must be at least 8 characters.';
      if (!passwordRules.uppercase.test(form.password)) nextErrors.password = 'Use at least one uppercase letter.';
      if (!passwordRules.symbol.test(form.password)) nextErrors.password = 'Include at least one symbol.';
      if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords must match.';
      if (!form.termsAccepted) nextErrors.termsAccepted = 'You must agree to the terms.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setActiveStep((prev) => Math.min(prev + 1, stepTitles.length - 1));
  };

  const handleBack = () => {
    setSubmitError('');
    setErrors({});
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    if (activeStep < stepTitles.length - 1) {
      handleNext();
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await register({
        firstName,
        lastName,
        middleName: form.middleName,
        username: form.username,
        email: form.email,
        password: form.password,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setSubmitError(err.message || 'Could not create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepFields = () => {
    const inputClass = (field: string) => {
      const state = getInputState(field);
      return `w-full rounded-2xl border px-4 py-3 text-sm bg-white/5 text-white transition-colors outline-none ${
        state === 'invalid'
          ? 'border-red-500 focus:border-red-400'
          : state === 'valid'
          ? 'border-emerald-500 focus:border-emerald-400'
          : 'border-white/10 focus:border-brand-accent'
      }`;
    };

    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-white/80">
              First Name <span className="text-brand-accent">*</span>
            </label>
            <input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="John"
              className={inputClass('firstName')}
              autoComplete="given-name"
            />
            {errors.firstName && <p className="text-xs text-red-400">{errors.firstName}</p>}

            <label className="block text-sm font-medium text-white/80">
              Last Name <span className="text-brand-accent">*</span>
            </label>
            <input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Smith"
              className={inputClass('lastName')}
              autoComplete="family-name"
            />
            {errors.lastName && <p className="text-xs text-red-400">{errors.lastName}</p>}

            <label className="block text-sm font-medium text-white/80">
              Middle Name
            </label>
            <input
              value={form.middleName}
              onChange={(e) => setForm({ ...form, middleName: e.target.value })}
              placeholder="David"
              className="w-full rounded-2xl border border-white/10 px-4 py-3 text-sm bg-white/5 text-white focus:border-brand-accent outline-none"
              autoComplete="additional-name"
            />

            <label className="block text-sm font-medium text-white/80">
              Username <span className="text-brand-accent">*</span>
            </label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder={suggestedUsername}
              className={inputClass('username')}
              autoComplete="username"
            />
            {errors.username && <p className="text-xs text-red-400">{errors.username}</p>}
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-white/80">
              Email Address <span className="text-brand-accent">*</span>
            </label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={suggestedEmail}
              type="email"
              className={inputClass('email')}
              autoComplete="email"
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}

            <label className="block text-sm font-medium text-white/80">
              Phone Number <span className="text-brand-accent">*</span>
            </label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+1 (234) 567-8901"
              className={inputClass('phone')}
              autoComplete="tel"
            />
            {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}

            <label className="block text-sm font-medium text-white/80">
              Country <span className="text-brand-accent">*</span>
            </label>
            <select
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className={inputClass('country')}
              autoComplete="country"
              aria-label="Select country"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && <p className="text-xs text-red-400">{errors.country}</p>}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-white/80">
              Currency <span className="text-brand-accent">*</span>
            </label>
            <select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className={inputClass('currency')}
              autoComplete="cc-csc"
              aria-label="Select currency"
            >
              <option value="">Select Currency</option>
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            {errors.currency && <p className="text-xs text-red-400">{errors.currency}</p>}

            <label className="block text-sm font-medium text-white/80">
              Account Type <span className="text-brand-accent">*</span>
            </label>
            <select
              value={form.accountType}
              onChange={(e) => setForm({ ...form, accountType: e.target.value })}
              className={inputClass('accountType')}
              aria-label="Select account type"
            >
              <option value="">Select Account Type</option>
              {accountTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.accountType && <p className="text-xs text-red-400">{errors.accountType}</p>}

            <label className="block text-sm font-medium text-white/80">
              Transaction PIN <span className="text-brand-accent">*</span>
            </label>
            <input
              value={form.transactionPin}
              onChange={(e) => setForm({ ...form, transactionPin: e.target.value })}
              placeholder="4-digit PIN"
              className={inputClass('transactionPin')}
              type="password"
              inputMode="numeric"
              maxLength={4}
              autoComplete="one-time-code"
            />
            {errors.transactionPin && <p className="text-xs text-red-400">{errors.transactionPin}</p>}
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-white/80">
              Password <span className="text-brand-accent">*</span>
            </label>
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Create strong password"
              className={inputClass('password')}
              type="password"
              autoComplete="new-password"
            />
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 bg-white/10 rounded overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${(passwordStrength() / 5) * 100}%` }} 
                  />
                </div>
                <div className="text-xs text-white/50">{passwordStrength()}/5</div>
              </div>
              <div className="text-xs grid grid-cols-2 gap-2 text-white/50">
                <div className={form.password.length >= passwordRules.minLength ? 'text-emerald-400' : 'text-white/40'}>• 8+ chars</div>
                <div className={passwordRules.uppercase.test(form.password) ? 'text-emerald-400' : 'text-white/40'}>• Uppercase</div>
                <div className={passwordRules.number.test(form.password) ? 'text-emerald-400' : 'text-white/40'}>• Number</div>
                <div className={passwordRules.symbol.test(form.password) ? 'text-emerald-400' : 'text-white/40'}>• Symbol</div>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
            </div>

            <label className="block text-sm font-medium text-white/80">
              Confirm Password <span className="text-brand-accent">*</span>
            </label>
            <input
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Confirm your password"
              className={inputClass('confirmPassword')}
              type="password"
              autoComplete="new-password"
            />
            {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword}</p>}

            <label className="flex items-center gap-2 text-sm text-white/80">
              <input
                type="checkbox"
                checked={form.termsAccepted}
                onChange={(e) => setForm({ ...form, termsAccepted: e.target.checked })}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-brand-accent accent-brand-accent"
              />
              I agree to the <span className="text-brand-accent">Terms of Service</span> and <span className="text-brand-accent">Privacy Policy</span>.
            </label>
            {errors.termsAccepted && <p className="text-xs text-red-400">{errors.termsAccepted}</p>}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-brand-dark overflow-hidden pt-20">
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 bg-brand-navy text-white overflow-hidden border-r border-brand-navy">
        <div className="absolute inset-0 z-0">
          <img
            src={imageSources.loginHero}
            alt="Novaa Security Base"
            className="w-full h-full object-cover mix-blend-overlay opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-brand-navy/90 border-r border-brand-accent/20"></div>
        </div>

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
              Private Banking
            </span>
            <h2 className="text-4xl lg:text-5xl font-display font-medium leading-tight">
              Create your Novaa account with secure onboarding.
            </h2>
            <p className="text-brand-light/70 text-base leading-relaxed">
              Complete the 4-step account creation process and get instant access to our dashboard experience.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <ShieldCheck size={28} className="text-brand-accent" />
            <div className="text-xs">
              <p className="font-semibold text-white">256-bit SSL Encryption</p>
              <p className="text-brand-light/60">Your account details are protected on sign-up and beyond.</p>
            </div>
          </div>
          <p className="text-xs text-brand-light/40">© 2026 Novaa Inc. All rights reserved.</p>
        </div>
      </div>

      <div className="lg:col-span-7 flex flex-col justify-center items-center px-4 sm:px-12 lg:px-20 py-12 bg-brand-dark/95 relative">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg space-y-8"
        >
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start items-center mb-6 lg:hidden">
              <NovaaLogo className="text-3xl text-white" iconSize={36} />
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-sm text-brand-light/60 mt-2">
              Step {activeStep + 1} of {stepTitles.length} — {stepTitles[activeStep]} information
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-2 justify-between mb-6">
              {stepTitles.map((step, index) => (
                <div key={step} className="flex-1 text-center">
                  <div
                    className={`mx-auto mb-2 h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold ${
                      index === activeStep
                        ? 'bg-brand-accent text-white'
                        : index < activeStep
                        ? 'bg-emerald-500/20 text-white'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-[11px] uppercase tracking-[1px] text-white/50">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-6">
              {renderStepFields()}

              {submitError && <p className="text-sm text-red-400">{submitError}</p>}

              <div className="flex flex-col gap-3 sm:flex-row justify-between items-center pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {activeStep === stepTitles.length - 1 ? (isSubmitting ? 'Creating...' : 'Create Account') : 'Next'}
                  <ChevronRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
