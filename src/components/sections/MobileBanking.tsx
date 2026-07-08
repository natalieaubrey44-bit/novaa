import { motion } from 'motion/react';
import { Smartphone, Zap, Fingerprint, BellRing, Plane, Lock } from 'lucide-react';

export default function MobileBanking() {
  const features = [
    { name: "Instant Transfers", icon: Zap },
    { name: "Virtual Cards", icon: Smartphone },
    { name: "Bill Payments", icon: Lock },
    { name: "Mobile Deposits", icon: Plane },
    { name: "Push Notifications", icon: BellRing },
    { name: "Biometric Login", icon: Fingerprint }
  ];

  return (
    <section className="py-24 bg-brand-primary text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Column: Phone Mockups */}
          <div className="w-full lg:w-1/2 flex justify-center relative">
            <motion.div 
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="relative w-64 h-[550px] bg-brand-primary border-4 border-gray-800 rounded-[3rem] shadow-2xl overflow-hidden"
            >
              {/* Phone Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 rounded-b-xl w-32 mx-auto z-50"></div>
              
              {/* App UI */}
              <div className="h-full w-full bg-brand-light dark:bg-brand-primary transition-colors p-6 pt-12 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs">JD</div>
                  <BellRing size={20} className="text-brand-primary/70 dark:text-brand-light transition-colors" />
                </div>
                
                <h4 className="text-brand-primary dark:text-white transition-colors font-display font-medium text-lg mb-2">Total Balance</h4>
                <h2 className="text-3xl font-display font-bold text-brand-primary dark:text-white transition-colors tracking-tight mb-8">$42,850<span className="text-brand-primary/70 text-xl">.00</span></h2>
                
                <div className="bg-brand-primary rounded-2xl p-5 text-white mb-6 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full"></div>
                  <p className="text-white/70 text-xs mb-8">Platinum Card</p>
                  <p className="font-mono text-sm tracking-widest mb-2">**** **** **** 4281</p>
                  <div className="flex justify-between items-center text-xs">
                    <span>Exp: 12/28</span>
                    <Smartphone size={16} />
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="text-brand-primary dark:text-white transition-colors font-medium text-sm mb-4">Quick Actions</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {[Zap, Plane, Fingerprint, Lock].map((Icon, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-white dark:bg-brand-secondary transition-colors rounded-xl shadow-sm flex items-center justify-center text-brand-primary dark:text-white border border-brand-primary/5">
                          <Icon size={18} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating secondary phone */}
            <motion.div 
               initial={{ opacity: 0, x: 40 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: 0.3 }}
               className="absolute -right-4 md:right-10 top-20 w-56 h-[480px] bg-brand-primary border-4 border-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden hidden sm:block z-[-1]"
            >
              <div className="h-full w-full bg-brand-primary p-6 pt-12">
                <div className="w-full h-32 bg-white/10 rounded-xl mb-4"></div>
                <div className="w-full h-12 bg-white/10 rounded-xl mb-2"></div>
                <div className="w-full h-12 bg-white/10 rounded-xl mb-2"></div>
                <div className="w-full h-12 bg-white/10 rounded-xl"></div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Content */}
          <div className="w-full lg:w-1/2">
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white text-xs font-semibold tracking-wide mb-6 border border-white/20">
                Premium Mobile Experience
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                Your Entire Bank <br /> In Your Pocket
              </h2>
              <p className="text-brand-light/70 text-lg mb-10 leading-relaxed max-w-lg">
                Manage your finances on the go with our award-winning mobile app. Designed for speed, security, and simplicity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-12">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-brand-accent">
                      <feature.icon size={18} />
                    </div>
                    <span className="font-medium text-white/90">{feature.name}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button className="flex items-center gap-3 bg-white dark:bg-brand-secondary transition-colors text-brand-primary dark:text-white px-6 py-3 rounded-xl hover:bg-brand-light font-medium border border-transparent shadow-lg">
                  <Smartphone size={24} />
                  <div className="text-left">
                    <span className="block text-[10px] leading-tight text-brand-primary/70 dark:text-brand-light/70">Download on the</span>
                    <span className="block text-sm">App Store</span>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-transparent text-white px-6 py-3 rounded-xl hover:bg-white/10 transition-colors font-medium border border-white/20">
                  <span className="font-display font-bold text-xl">G</span>
                  <div className="text-left">
                    <span className="block text-[10px] leading-tight text-white/70">GET IT ON</span>
                    <span className="block text-sm">Google Play</span>
                  </div>
                </button>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
