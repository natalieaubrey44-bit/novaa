import { motion } from 'motion/react';
import { Target, TrendingUp, Bell, CheckCircle2 } from 'lucide-react';

export default function SmartMoney() {
  return (
    <section className="py-24 bg-brand-muted dark:bg-brand-surface transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Column: Visual Diagram */}
          <div className="w-full lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-8 md:p-12 bg-white dark:bg-brand-secondary transition-colors rounded-[3rem] border border-brand-primary/5 shadow-inner"
            >
              <h3 className="text-center font-display font-medium text-brand-primary/60 mb-8 text-sm tracking-widest uppercase">Monthly Cash Flow</h3>
              
              <div className="flex flex-col gap-6">
                {/* Income block */}
                <div className="bg-brand-primary text-white p-5 rounded-2xl shadow-xl z-20 flex justify-between items-center relative">
                   <div>
                     <p className="text-brand-light/70 text-sm mb-1">Total Income</p>
                     <p className="text-2xl font-bold font-display">$8,450.00</p>
                   </div>
                   <TrendingUp className="text-brand-success opacity-80" />
                   
                   {/* Connection lines origin */}
                   <div className="absolute left-8 -bottom-8 w-0.5 h-8 bg-brand-primary/20 z-0"></div>
                </div>

                {/* Automation blocks */}
                <div className="grid grid-cols-2 gap-4 pt-4 ml-8 relative border-l-2 border-brand-primary/20 pl-8 pb-4">
                  {/* Connectors */}
                  <div className="absolute top-8 -left-[2px] w-8 h-0.5 bg-brand-primary/20 z-0"></div>
                  <div className="absolute top-28 -left-[2px] w-8 h-0.5 bg-brand-primary/20 z-0"></div>
                  <div className="absolute top-48 -left-[2px] w-8 h-0.5 bg-brand-primary/20 z-0"></div>
                  <div className="absolute top-64 w-8 h-8 rounded-bl-xl border-l-2 border-b-2 border-brand-primary/20 -left-[2px]"></div>

                  {/* Nodes */}
                  <div className="col-span-2 bg-white dark:bg-brand-secondary transition-colors p-4 rounded-xl shadow-sm border border-brand-primary/5 flex items-center justify-between">
                     <span className="font-medium text-sm text-brand-primary dark:text-white transition-colors flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand-primary"></div> Housing & Utilities</span>
                     <span className="font-semibold text-brand-primary dark:text-brand-light transition-colors text-sm">$2,800</span>
                  </div>

                  <div className="col-span-2 bg-white dark:bg-brand-secondary transition-colors p-4 rounded-xl shadow-sm border border-brand-accent/20 flex items-center justify-between">
                     <span className="font-medium text-sm text-brand-primary dark:text-white transition-colors flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand-accent"></div> Auto-Savings</span>
                     <span className="font-semibold text-brand-accent text-sm">$1,500</span>
                  </div>

                  <div className="col-span-2 bg-white dark:bg-brand-secondary transition-colors p-4 rounded-xl shadow-sm border border-brand-success/20 flex items-center justify-between">
                     <span className="font-medium text-sm text-brand-primary dark:text-white transition-colors flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand-success"></div> Investments</span>
                     <span className="font-semibold text-brand-success text-sm">$1,000</span>
                  </div>

                  <div className="col-span-2 ml-8 bg-white dark:bg-brand-secondary transition-colors p-4 rounded-xl shadow-sm border border-brand-primary/5 flex items-center justify-between">
                     <span className="font-medium text-sm text-brand-primary dark:text-white transition-colors flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand-secondary"></div> Daily Spending</span>
                     <span className="font-semibold text-brand-primary dark:text-brand-light transition-colors text-sm">$3,150</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Content */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-primary dark:text-white transition-colors mb-6">
                Automate Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-primary">Financial Success</span>
              </h2>
              <p className="text-brand-primary/80 text-lg mb-8 leading-relaxed">
                Take the guesswork out of saving and investing. Set your goals, define your rules, and let our smart algorithms handle the rest while you focus on living.
              </p>

              <div className="space-y-6 mb-10">
                {[
                  { title: "Smart Budget Tracking", desc: "Categorize spending automatically and get real-time alerts.", icon: Target },
                  { title: "Automated Savings Rules", desc: "Round up change, save a percentage of income, or set fixed transfers.", icon: TrendingUp },
                  { title: "Proactive Financial Insights", desc: "Get personalized notifications about upcoming bills and spending patterns.", icon: Bell },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0 mt-1">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-brand-primary dark:text-white transition-colors mb-1">{feature.title}</h4>
                      <p className="text-brand-primary/80 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="px-8 py-4 rounded-full bg-brand-primary text-white font-medium hover:bg-brand-secondary transition-all shadow-xl hover:-translate-y-0.5">
                Start Saving Smarter
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
