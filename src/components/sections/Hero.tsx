import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, TrendingUp, CreditCard, Bell } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-brand-navy pt-[64px] sm:pt-[72px]">

      {/* Subtle grid — institutional texture, not decorative */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Restrained glow — bottom left only */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/6 rounded-full blur-[6rem] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-10 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">

          {/* ── Left column: content ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-block w-6 h-px bg-brand-accent" />
              <span className="text-brand-accent text-[10px] font-medium tracking-[3px] uppercase">
                Member FDIC · Est. 2012
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-white leading-[1.12] tracking-tight mb-6">
              Save more.<br />
              Pay nothing.<br />
              <span className="text-brand-accent">Bank with confidence.</span>
            </h1>

            <p className="text-base text-white/50 leading-relaxed mb-10 max-w-full lg:max-w-md font-light">
              Earn 5.25% APY on savings with zero monthly fees, zero minimums, and FDIC insurance up to $250,000.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                to="/login"
                className="px-7 py-3.5 rounded-sm bg-brand-accent text-white font-medium hover:bg-brand-accent/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group text-sm tracking-wide"
              >
                Open an account
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/personal"
                className="px-7 py-3.5 rounded-sm bg-transparent text-white/60 border border-white/10 hover:border-white/25 hover:text-white/90 transition-all flex items-center justify-center text-sm tracking-wide"
              >
                See all products
              </Link>
            </div>

            {/* Trust line */}
            <div className="flex items-center gap-2 text-white/30 text-xs">
              <ShieldCheck size={13} className="text-brand-accent shrink-0" />
              <span>FDIC insured · No credit check · Cancel anytime</span>
            </div>
          </motion.div>

          {/* ── Right column: coded product mockup ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
            className="relative flex justify-center lg:justify-end min-w-0"
          >
            {/* Outer glow behind the card */}


            {/* Dashboard preview card */}
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-sm rounded-xl border border-white/10 bg-brand-surface overflow-hidden">

              {/* Top accent line */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />

              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-sm bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center">
                    <span className="text-brand-accent text-[9px] font-semibold">N</span>
                  </div>
                  <span className="text-white/50 text-[11px] tracking-widest uppercase font-medium">Novaa Private</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-success inline-block" />
                  <span className="text-white/30 text-[10px] tracking-wide">Live</span>
                </div>
              </div>

              {/* Balance block */}
              <div className="px-5 pt-6 pb-4">
                <p className="text-[10px] text-white/30 uppercase tracking-[2px] mb-1">Total balance</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-white/40 text-lg font-light">$</span>
                  <span className="text-white text-4xl font-semibold tracking-tight">42,850</span>
                  <span className="text-white/30 text-lg font-light">.00</span>
                </div>
                <p className="text-[10px] text-brand-success/70 flex items-center gap-1">
                  <TrendingUp size={10} />
                  +$1,245.00 this month
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-white/6 border-t border-white/6 px-5 mb-5 rounded-lg overflow-hidden border border-white/6">
                {[
                  { val: '5.25%', label: 'APY' },
                  { val: '$250K', label: 'FDIC' },
                  { val: '$0', label: 'Monthly fee' },
                ].map((s) => (
                  <div key={s.label} className="px-3 py-3 flex flex-col gap-0.5 bg-white/3">
                    <span className="text-white text-sm font-medium tracking-tight">{s.val}</span>
                    <span className="text-white/30 text-[9px] uppercase tracking-widest">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Recent activity */}
              <div className="px-5 pb-2">
                <p className="text-[9px] text-white/25 uppercase tracking-[2px] mb-3">Recent activity</p>
                <div className="space-y-2.5">
                  {[
                    { label: 'Interest credit', amount: '+$185.20', positive: true, icon: TrendingUp },
                    { label: 'Card payment', amount: '-$42.00', positive: false, icon: CreditCard },
                    { label: 'Rate alert', amount: '5.25% APY', positive: true, icon: Bell },
                  ].map((tx) => (
                    <div key={tx.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-sm bg-white/5 border border-white/8 flex items-center justify-center">
                          <tx.icon size={11} className="text-white/40" />
                        </div>
                        <span className="text-white/50 text-[11px]">{tx.label}</span>
                      </div>
                      <span className={`text-[11px] font-medium font-mono ${tx.positive ? 'text-brand-success' : 'text-white/40'}`}>
                        {tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card chip mockup */}
              <div className="px-5 mt-4 mb-5 rounded-lg bg-white/4 border border-white/8 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-white/25 uppercase tracking-[2px] mb-1">Card</p>
                  <p className="text-white/60 text-xs font-mono tracking-widest">•••• •••• •••• 4820</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-white/25 uppercase tracking-[2px] mb-1">Expires</p>
                  <p className="text-white/50 text-xs font-mono">12/29</p>
                </div>
              </div>

              {/* Bottom gradient fade */}
              <div className="h-8 bg-gradient-to-t from-brand-surface to-transparent" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}