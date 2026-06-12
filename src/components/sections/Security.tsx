import { motion } from 'motion/react';
import { Lock, Eye, Fingerprint, Bell } from 'lucide-react';

export default function Security() {
  return (
    <section className="py-24 bg-brand-light dark:bg-brand-primary transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Column: Image */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl group"
            >
              <div className="absolute inset-0 bg-brand-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=2000&auto=format&fit=crop" 
                alt="Cybersecurity and data protection" 
                className="w-full h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              {/* Optional overlay badge */}
              <div className="absolute bottom-8 left-8 z-20 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 flex items-center gap-4">
                 <div className="w-12 h-12 bg-brand-success/10 rounded-full flex items-center justify-center text-brand-success">
                   <Lock size={24} />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-brand-primary dark:text-white transition-colors">Bank-Grade</p>
                   <p className="text-xs text-brand-secondary dark:text-brand-light transition-colors">256-bit Encryption</p>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Cards */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-primary dark:text-white transition-colors mb-4">
                Security At Every Step
              </h2>
              <p className="text-brand-primary/80 dark:text-white/80 text-lg mb-10 leading-relaxed">
                Your peace of mind is our priority. We employ industry-leading security measures to ensure your money and data are always protected.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Lock, title: "Encryption", desc: "Military-grade 256-bit encryption for all data." },
                  { icon: Eye, title: "Fraud Monitoring", desc: "24/7 AI-driven behavioral monitoring." },
                  { icon: Fingerprint, title: "Biometrics", desc: "Secure login using your unique footprint." },
                  { icon: Bell, title: "Real-Time Alerts", desc: "Instant notifications for every transaction." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-brand-secondary transition-colors p-6 rounded-2xl shadow-sm border border-brand-primary/5"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-light dark:bg-brand-primary transition-colors flex items-center justify-center text-brand-primary dark:text-white transition-colors mb-4">
                      <item.icon size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-brand-primary dark:text-white transition-colors mb-2">{item.title}</h4>
                    <p className="text-sm text-brand-primary/70 dark:text-white/70 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
