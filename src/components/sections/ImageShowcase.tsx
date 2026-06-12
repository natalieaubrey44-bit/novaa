import { motion } from 'motion/react';

export default function ImageShowcase() {
  return (
    <section className="py-24 bg-brand-light dark:bg-brand-primary transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-primary dark:text-white transition-colors mb-6">
            Banking For <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-primary">Every Stage</span>
          </h2>
          <p className="text-lg text-brand-primary/80 dark:text-white/80 max-w-2xl mx-auto">
            From your first savings account to scaling your global enterprise, we provide the tools and support to help you thrive.
          </p>
        </div>

        {/* Masonry Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[800px] md:h-[600px]">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-brand-primary/40 group-hover:bg-brand-primary/20 transition-all duration-500 z-10"></div>
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2000&auto=format&fit=crop" alt="Business team" className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute bottom-8 left-8 right-8 z-20">
              <h3 className="text-2xl font-bold text-white mb-2">Business Growth</h3>
              <p className="text-white/80 text-sm">Scale your enterprise with custom financing.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 md:row-span-1 relative rounded-3xl overflow-hidden group h-[200px] md:h-auto"
          >
            <div className="absolute inset-0 bg-brand-primary/40 group-hover:bg-brand-primary/20 transition-all duration-500 z-10"></div>
            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop" alt="Retail pos" className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <h3 className="text-xl font-bold text-white mb-1">Retail Banking</h3>
              <p className="text-white/80 text-sm">Daily financial health.</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group h-[200px] md:h-auto"
          >
            <div className="absolute inset-0 bg-brand-primary/40 group-hover:bg-brand-primary/20 transition-all duration-500 z-10"></div>
            <img src="https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=1000&auto=format&fit=crop" alt="Mobile banking" className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <h3 className="text-lg font-bold text-white mb-1">Mobile First</h3>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden group h-[200px] md:h-auto"
          >
            <div className="absolute inset-0 bg-brand-primary/40 group-hover:bg-brand-primary/20 transition-all duration-500 z-10"></div>
            <img src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1000&auto=format&fit=crop" alt="Financial planning" className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <h3 className="text-lg font-bold text-white mb-1">Wealth Management</h3>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
