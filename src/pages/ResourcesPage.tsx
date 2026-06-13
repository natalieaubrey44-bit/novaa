import { motion } from 'motion/react';
import ResourcesSection from '../components/sections/Resources';
import FinalCta from '../components/sections/FinalCta';

export default function ResourcesPage() {
  return (
    <div className="w-full relative">
      {/* Page Hero */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 flex items-center bg-brand-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2000&auto=format&fit=crop" 
            alt="Financial Resources" 
            className="w-full h-full object-cover grayscale opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/80 via-brand-primary/50 to-brand-primary/10"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white mb-6">
              Financial <br/><span className="text-brand-accent">Knowledge Hub</span>
            </h1>
            <p className="text-lg lg:text-xl text-brand-light/80 leading-relaxed mb-10">
              Insightful articles, guides, and research to help you navigate complex financial decisions and secure your future.
            </p>
          </motion.div>
        </div>
      </section>

      <ResourcesSection />

      <section className="py-24 bg-brand-muted dark:bg-brand-surface transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-brand-primary dark:text-white transition-colors mb-12">Search by Topic</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Market Outlook", "Retirement Planning", "Tax Strategies", "Real Estate", "Crypto & Web3", "Personal Budgeting", "Business Financing"].map((topic, i) => (
              <span key={i} className="px-6 py-3 rounded-full bg-white dark:bg-brand-secondary transition-colors border border-brand-primary/10 text-brand-primary dark:text-white font-medium hover:bg-brand-primary hover:text-white cursor-pointer shadow-sm">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </div>
  );
}
