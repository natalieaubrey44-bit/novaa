import { motion } from 'motion/react';
import Loans from '../components/sections/Loans';
import FinancialTools from '../components/sections/FinancialTools';
import FinalCta from '../components/sections/FinalCta';
import { imageSources } from '../data/imageSources';

export default function LoansPage() {
  return (
    <div className="w-full relative">
      {/* Page Hero */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={imageSources.loansHero} 
            alt="Loans and Financing" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/70 to-slate-950/40" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white mb-6">
              Financing For <br/><span className="text-brand-accent">Your Aspirations</span>
            </h1>
            <p className="text-lg lg:text-xl text-brand-light/80 leading-relaxed mb-10">
              Competitive rates and transparent terms for personal loans, mortgages, and business expansion.
            </p>
          </motion.div>
        </div>
      </section>

      <Loans />
      <FinancialTools />
      <FinalCta />
    </div>
  );
}
