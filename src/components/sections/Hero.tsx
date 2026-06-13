import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-brand-navy">

      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/80 to-brand-navy/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-xl">
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

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-display font-semibold text-white leading-[1.1] tracking-tight mb-6">
              Save more.<br />
              Pay nothing.<br />
              <span className="text-brand-accent">Bank with confidence.</span>
            </h1>

            <p className="text-base sm:text-lg text-white/55 leading-relaxed mb-10 max-w-md font-light">
              Earn 5.25% APY on savings with zero monthly fees, zero minimums, and FDIC insurance up to $250,000.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                to="/login"
                className="px-8 py-4 rounded-sm bg-brand-accent text-white font-semibold hover:bg-brand-accent/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer text-sm tracking-wide"
              >
                Open an account
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust line */}
            <div className="flex items-center gap-2 text-white/35 text-xs">
              <ShieldCheck size={14} className="text-brand-accent shrink-0" />
              <span>FDIC insured · Routing #021000021 · No credit check required</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}