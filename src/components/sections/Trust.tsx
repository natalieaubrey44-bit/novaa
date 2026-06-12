import { motion, useInView, animate } from 'motion/react';
import { Shield, Users, Clock, Globe } from 'lucide-react';
import { useEffect, useRef } from 'react';

function Counter({ from = 0, to, duration = 2, prefix = '', suffix = '' }: { from?: number, to: number, duration?: number, prefix?: string, suffix?: string }) {
  const nodeRef = useRef<HTMLHeadingElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "0px 0px -50px 0px" });

  useEffect(() => {
    if (inView && nodeRef.current) {
      const controls = animate(from, to, {
        duration: duration,
        ease: "easeOut",
        onUpdate(value) {
           if (nodeRef.current) {
             const formatted = Math.floor(value).toLocaleString();
             nodeRef.current.textContent = `${prefix}${formatted}${suffix}`;
           }
        }
      });
      return () => controls.stop();
    }
  }, [from, to, duration, inView, prefix, suffix]);

  return <h3 ref={nodeRef} className="text-2xl md:text-3xl font-display font-bold text-white mb-2">{prefix}{from}{suffix}</h3>;
}

export default function Trust() {
  const stats = [
    { label: "Active Customers", to: 1250320, suffix: "+", icon: Users },
    { label: "Assets Managed", prefix: "$", to: 54000000, suffix: "+", icon: Globe },
    { label: "Daily Transactions", to: 850400, suffix: "+", icon: Clock },
    { label: "Support Tickets Fixed", to: 99990, suffix: "+", icon: Shield }
  ];

  return (
    <section className="py-16 bg-brand-navy text-white relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent mb-3">
                <stat.icon size={20} />
              </div>
              <Counter prefix={stat.prefix} to={stat.to} suffix={stat.suffix} />
              <p className="text-brand-light/70 text-xs sm:text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
