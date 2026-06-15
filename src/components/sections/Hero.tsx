import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, TrendingUp, PiggyBank, Shield } from 'lucide-react';

const features = [
  {
    icon: PiggyBank,
    label: 'FDIC insured',
    description: 'Up to $250K protection on eligible accounts',
  },
  {
    icon: Shield,
    label: 'Secure access',
    description: 'Biometric login, device controls, and encryption',
  },
  {
    icon: TrendingUp,
    label: 'High yield',
    description: '5.25% APY savings with no monthly fees',
  },
];

export default function Hero() {
  return (
    <section className="relative w-full min-h-[calc(100dvh-64px)] sm:min-h-[calc(100dvh-72px)] overflow-hidden bg-brand-navy pt-[64px] sm:pt-[72px] flex items-center">
      {/* Background Glow Design Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-28 top-10 h-96 w-96 rounded-full bg-brand-accent/15 blur-[6rem]" />
        <div className="absolute right-[-10%] top-1/4 h-[500px] w-[500px] rounded-full bg-brand-accent/10 blur-[100px]" />
        <div className="absolute left-1/3 bottom-10 h-64 w-64 rounded-full bg-white/5 blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 xl:px-16 relative z-10 w-full py-12 sm:py-16 lg:py-24">
        {/* Responsive Grid System */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.1fr_minmax(400px,440px)] items-center">

          {/* Left Column: Typography & Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="min-w-0"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 mb-7">
              <PiggyBank size={14} className="text-brand-accent" />
              <span className="font-medium tracking-wide">Next-Gen Wealth Infrastructure</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-white leading-[1.1] tracking-tight max-w-3xl">
              The banking engine built for{' '}
              <span className="bg-gradient-to-r from-white via-white to-brand-accent bg-clip-text text-transparent">
                the future.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg text-white/70 leading-relaxed font-light">
              Experience intelligent asset tracking, instantaneous cross-border transfers, and elite algorithmic security infrastructure. All compressed into one dark-mode dashboard.
            </p>

            {/* Interactive CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-full bg-brand-accent px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-brand-accent/20 transition-all hover:bg-brand-accent/90 active:scale-[0.98] gap-2 group"
              >
                Open Free Account
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/personal"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm text-white/90 transition-all hover:bg-white/10"
              >
                Explore Dashboard
              </Link>
            </div>

            {/* Micro-Features Row */}
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.label} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent mb-3">
                      <Icon size={16} />
                    </div>
                    <p className="text-sm font-semibold text-white mb-1">{feature.label}</p>
                    <p className="text-xs text-white/60 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Floating Premium Interface Component */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
            className="relative w-full flex justify-center lg:justify-end"
          >
            {/* Smooth hardware-accelerated float animations wrapper */}
            <motion.div
              className="w-full aspect-[1.58/1] bg-gradient-to-br from-white/[0.06] to-white/[0.01] border border-white/10 backdrop-blur-xl rounded-[24px] p-8 flex flex-col justify-between shadow-[0_32px_80px_rgba(0,0,0,0.4)] relative"
              initial={{ y: 0, rotate: 2 }}
              animate={{ y: [-10, 10, -10], rotate: [2, -1, 2] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Card Top Header */}
              <div className="flex justify-between items-start">
                {/* Physical Chip Simulation */}
                <div className="w-[44px] h-[32px] bg-gradient-to-br from-amber-400 to-amber-700 rounded-md opacity-85 shadow-inner" />
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5 font-display font-semibold tracking-wider text-white">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-accent/20 text-brand-accent text-xs font-bold">
                      N
                    </div>
                    <span>NOVAA</span>
                  </div>
                  <span className="text-[9px] font-bold tracking-[2px] text-white/40 mt-1 uppercase">Platinum</span>
                </div>
              </div>

              {/* Card Number Line */}
              <div className="text-xl sm:text-2xl tracking-[4px] text-white/90 font-mono my-4">
                4000 1234 5678 9010
              </div>

              {/* Card Footer Meta */}
              <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-wider">
                <div>
                  <span className="block text-[8px] tracking-normal mb-0.5 text-white/30">Card Holder</span>
                  <span className="text-white/90 font-medium tracking-wide">Alex Mercer</span>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] tracking-normal mb-0.5 text-white/30">Expires</span>
                  <span className="text-white/90 font-medium tracking-wide">12/29</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}