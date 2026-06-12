import { motion } from 'motion/react';
import { ArrowRight, Landmark, CreditCard, PieChart, Wallet } from 'lucide-react';

export default function Products() {
  const products = [
    {
      title: "Checking Accounts",
      description: "Fee-free daily banking with instant notifications, virtual cards, and smart budgeting tools.",
      icon: Wallet,
      tag: "Everyday"
    },
    {
      title: "Savings Accounts",
      description: "Grow your wealth faster with industry-leading APY, automated savings, and custom goal tracking.",
      icon: Landmark,
      tag: "High Yield"
    },
    {
      title: "Loans & Mortgages",
      description: "Access financing quickly with competitive rates, flexible terms, and instant pre-approvals.",
      icon: CreditCard,
      tag: "Financing"
    },
    {
      title: "Investments",
      description: "Build your portfolio with commission-free trading, expert portfolios, and robo-advisory tools.",
      icon: PieChart,
      tag: "Wealth"
    }
  ];

  return (
    <section className="py-24 bg-brand-light dark:bg-brand-primary transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-primary dark:text-white transition-colors mb-6">
              Everything You Need To <br /> Manage Your Money
            </h2>
            <p className="text-lg text-brand-primary/80 dark:text-white/80">
              A complete ecosystem of financial products designed to work together seamlessly, helping you achieve your goals faster.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-brand-secondary transition-colors rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-primary/5 group relative overflow-hidden"
            >
              {/* Hover Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-brand-primary/5 flex items-center justify-center text-brand-primary dark:text-white transition-colors group-hover:bg-brand-accent group-hover:text-white transition-colors duration-300">
                    <product.icon size={28} />
                  </div>
                  <span className="text-xs font-semibold text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full">
                    {product.tag}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-brand-primary dark:text-white transition-colors mb-3">
                  {product.title}
                </h3>
                <p className="text-sm text-brand-primary/70 dark:text-white/70 mb-8 leading-relaxed">
                  {product.description}
                </p>
                
                <a href="#" className="flex items-center gap-2 text-brand-primary dark:text-white transition-colors font-medium text-sm group-hover:text-brand-accent transition-colors">
                  Learn more <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
