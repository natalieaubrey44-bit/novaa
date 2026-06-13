import { motion } from 'motion/react';
import FinalCta from '../components/sections/FinalCta';

export default function Investments() {
  return (
    <div className="w-full relative">
      {/* Page Hero */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 flex items-center bg-brand-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2000&auto=format&fit=crop" 
            alt="Investments" 
            className="w-full h-full object-cover"
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
              Grow Your <br/><span className="text-brand-accent">Wealth Potential</span>
            </h1>
            <p className="text-lg lg:text-xl text-brand-light/80 leading-relaxed mb-10">
              Access global markets with commission-free trading, expert portfolios, and specialized wealth management advisors.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-brand-light dark:bg-brand-primary transition-colors text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-primary dark:text-white transition-colors mb-6">Investment Portfolios</h2>
          <p className="text-lg text-brand-primary/80 mb-12">Choose from our automated robo-advisory funds or take control with custom asset allocation strategies.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-white dark:bg-brand-secondary transition-colors rounded-3xl p-8 border border-brand-primary/10 shadow-sm">
              <h3 className="text-2xl font-bold text-brand-primary dark:text-white transition-colors mb-2">Automated Investing</h3>
              <p className="text-brand-accent font-semibold mb-6">0.25% Advisory Fee</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-brand-primary/80 dark:text-brand-light/80"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/30"></div> Algorithmically driven</li>
                <li className="flex items-center gap-2 text-sm text-brand-primary/80 dark:text-brand-light/80"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/30"></div> Automatic rebalancing</li>
                <li className="flex items-center gap-2 text-sm text-brand-primary/80 dark:text-brand-light/80"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/30"></div> Tax-loss harvesting</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-brand-primary text-white font-medium hover:bg-brand-secondary transition-colors">Start Automated</button>
            </div>
            <div className="bg-brand-secondary rounded-3xl p-8 border border-transparent shadow-md text-white">
              <h3 className="text-2xl font-bold text-white mb-2">Self-Directed</h3>
              <p className="text-brand-accent font-semibold mb-6">$0 Commissions</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-brand-light/80"><div className="w-1.5 h-1.5 rounded-full bg-brand-accent"></div> Trade stocks & ETFs</li>
                <li className="flex items-center gap-2 text-sm text-brand-light/80"><div className="w-1.5 h-1.5 rounded-full bg-brand-accent"></div> Advanced research tools</li>
                <li className="flex items-center gap-2 text-sm text-brand-light/80"><div className="w-1.5 h-1.5 rounded-full bg-brand-accent"></div> Real-time market data</li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-brand-accent text-brand-primary dark:text-white transition-colors font-bold hover:bg-brand-accent/90">Open Brokerage</button>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </div>
  );
}
