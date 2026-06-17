import { Link } from 'react-router-dom';
import { motion, animate } from 'motion/react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { imageSources } from '../../data/imageSources';

function StatValue({ from, to, formatter, duration = 1.4 }: {
  from: number;
  to: number;
  formatter: (value: number) => string;
  duration?: number;
}) {
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!valueRef.current) return;

    const controls = animate(from, to, {
      duration,
      ease: 'easeOut',
      onUpdate(value) {
        if (!valueRef.current) return;
        valueRef.current.textContent = formatter(value);
      },
    });

    return () => controls.stop();
  }, [from, to, duration, formatter]);

  return <span ref={valueRef}>{formatter(from)}</span>;
}

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-navy pt-[64px] sm:pt-[72px]">

      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageSources.heroBg}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/70 to-slate-950/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-4 text-center sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col items-center w-full"
        >

          {/* Headline */}
          <h1 className="mb-3 text-3xl font-display font-semibold leading-[1.04] tracking-tight sm:mb-4 sm:text-4xl lg:text-[3.2rem] text-white drop-shadow-[0_25px_45px_rgba(0,0,0,0.45)]">
            Save more.<br />
            Pay nothing.<br />
            <span className="text-brand-accent">Bank with confidence.</span>
          </h1>

          {/* Subhead */}
          <p className="mb-5 max-w-md text-sm leading-relaxed font-light sm:mb-6 sm:text-[1rem] text-slate-100/90 drop-shadow-[0_18px_35px_rgba(0,0,0,0.32)]">
            Earn 5.25% APY on savings with zero monthly fees, zero minimums, and FDIC insurance up to $250,000.
          </p>

          {/* CTA */}
          <Link
            to="/login"
            className="mb-4 flex items-center gap-2 rounded-sm bg-brand-accent px-6 py-3 text-sm font-medium tracking-wide text-white transition-all hover:bg-brand-accent/90 active:scale-[0.98] group sm:mb-5 sm:px-7 sm:py-3.5"
          >
            Open an account
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Trust line */}
          <div className="mb-5 flex items-center gap-2 text-xs sm:mb-6 text-white/30">
            <ShieldCheck size={13} className="text-brand-accent shrink-0" />
            <span>FDIC insured · No credit check · Cancel anytime</span>
          </div>

          {/* Stat row */}
          <div className="grid w-full grid-cols-2 gap-4 border-t border-white/8 pt-4 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-white/8 sm:pt-6">
            {[
              {
                from: 10,
                to: 5.25,
                formatter: (value: number) => `${value.toFixed(2)}%`,
                label: 'HYSA APY',
              },
              {
                from: 10,
                to: 0,
                formatter: (value: number) => `$${Math.round(value)}`,
                label: 'Monthly fee',
              },
              {
                from: 0,
                to: 250000,
                formatter: (value: number) => `$${Math.round(value / 1000)}K`, 
                label: 'FDIC insured',
              },
              {
                from: 0,
                to: 1000000,
                formatter: (value: number) => {
                  const thousands = Math.round(value / 1000);
                  return thousands >= 1000 ? '1M+' : `${thousands}K+`;
                },
                label: 'Customers',
              },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 sm:px-8">
                <span className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                <StatValue
                  from={stat.from}
                  to={stat.to}
                  formatter={stat.formatter}
                  duration={1.5}
                />
              </span>
              <span className="text-[10px] uppercase tracking-[2px] text-white/30">{stat.label}</span>
              </div>
            ))}
          </div>

        </motion.div>
      </div>

    </section>
  );
}