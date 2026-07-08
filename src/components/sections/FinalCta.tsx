import { motion } from 'motion/react';
import { ArrowRight, Phone } from 'lucide-react';

export default function FinalCta() {
  return (
    <section className="py-32 relative bg-brand-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-brand-light text-sm font-semibold tracking-wider uppercase mb-8 border border-white/20">
            Join 1 Million+ Customers
          </span>
          
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
            Ready To Take Control Of <br className="hidden md:block" /> Your Financial Future?
          </h2>
          
          <p className="text-xl text-brand-light/80 mb-12 max-w-2xl mx-auto">
            Open an account in under 5 minutes. No hidden fees, no paperwork, just seamless modern banking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-accent text-white font-bold hover:bg-brand-accent/90 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group">
              Open Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 text-white border border-white/20 font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Phone size={20} /> Speak To An Advisor
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
