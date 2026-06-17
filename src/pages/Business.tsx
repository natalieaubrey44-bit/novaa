import { motion } from 'motion/react';
import Testimonials from '../components/sections/Testimonials';
import FinalCta from '../components/sections/FinalCta';
import { imageSources } from '../data/imageSources';

export default function Business() {
  return (
    <div className="w-full relative">
      {/* Page Hero */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={imageSources.businessHero} 
            alt="Business Banking" 
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
              Solutions for <br/><span className="text-brand-accent">Modern Business</span>
            </h1>
            <p className="text-lg lg:text-xl text-brand-light/80 leading-relaxed mb-10">
              Scale your enterprise with intelligent corporate accounts, powerful API access, and dedicated advisory services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature section */}
      <section className="py-24 bg-brand-light dark:bg-brand-primary transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Corporate Cards", desc: "Issue virtual and physical cards for your team instantly with spend limits." },
              { title: "Payment Processing", desc: "Accept payments globally with industry-leading low transaction rates." },
              { title: "Treasury Management", desc: "Optimize your cash flow and maximize yields on idle corporate funds." }
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-brand-secondary transition-colors p-8 rounded-2xl shadow-sm border border-brand-primary/5">
                <h3 className="text-xl font-bold text-brand-primary dark:text-white transition-colors mb-3">{feature.title}</h3>
                <p className="text-brand-primary/80">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <FinalCta />
    </div>
  );
}
