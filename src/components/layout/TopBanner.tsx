import { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const WARNINGS_AND_PROMOS = [
  {
    type: 'fraud',
    icon: AlertTriangle,
    text: 'FRAUD ALERT: Novaa will never ask for your password, PIN, or 2FA codes via phone, SMS, or email.',
    color: 'text-amber-400',
  },
  {
    type: 'promo',
    icon: TrendingUp,
    text: 'NOW LIVE: Earn up to 5.25% APY on high-yield Savings Vaults. Standard terms apply.',
    color: 'text-brand-accent',
  },
  {
    type: 'security',
    icon: ShieldCheck,
    text: 'STAY SECURE: Enable biometric authentication and instant transaction alerts in your account settings.',
    color: 'text-brand-accent',
  },
  {
    type: 'info',
    icon: Info,
    text: 'FDIC INSURED: All deposits are federally insured up to $250,000 per depositor.',
    color: 'text-brand-accent',
  }
];

export default function TopBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % WARNINGS_AND_PROMOS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentItem = WARNINGS_AND_PROMOS[index];
  const IconComponent = currentItem.icon;

  return (
    <div className="w-full bg-brand-navy dark:bg-brand-navy border-b border-white/5 text-white py-2 px-4 text-[11px] sm:text-xs font-sans relative z-50 flex items-center justify-between select-none transition-colors">

      {/* Left — FDIC Badge */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-semibold tracking-widest text-white/80 bg-white/5 px-2.5 py-0.5 rounded-sm text-[9px] uppercase border border-white/10">
          <ShieldCheck size={11} className="text-brand-accent" />
          Member FDIC
        </span>
        <span className="hidden sm:inline-block text-white/30 font-medium uppercase tracking-widest text-[9px]">
          Equal Housing Lender
        </span>
      </div>

      {/* Center — Cycling Messages */}
      <div className="flex-1 max-w-xl mx-auto px-4 overflow-hidden relative h-5 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex items-center justify-center gap-2 text-center"
          >
            <IconComponent size={13} className={`${currentItem.color} shrink-0`} />
            <span className="text-white/70 text-[10px] sm:text-[11px] font-sans font-normal tracking-wide truncate max-w-xs md:max-w-md lg:max-w-xl">
              {currentItem.text}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right — Status */}
      <div className="hidden lg:flex items-center gap-2 text-white/30 font-sans text-[9px] tracking-widest uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-accent inline-block" />
        <span>Systems Secure</span>
      </div>

    </div>
  );
}