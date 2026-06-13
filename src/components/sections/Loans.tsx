import { motion } from 'motion/react';
import { Home, Car, User, Briefcase, ArrowRight } from 'lucide-react';

export default function Loans() {
  const loans = [
    {
      title: "Personal Loan",
      icon: User,
      rate: "From 6.99% APR",
      benefits: ["Up to $50,000", "No hidden fees", "Next-day funding"],
    },
    {
      title: "Business Loan",
      icon: Briefcase,
      rate: "From 5.49% APR",
      benefits: ["Up to $500,000", "Flexible terms", "Dedicated advisor"],
    },
    {
      title: "Mortgage",
      icon: Home,
      rate: "From 6.12% APR",
      benefits: ["Fixed & adjustable", "First-time buyer perks", "Easy closing"],
    },
    {
      title: "Vehicle Loan",
      icon: Car,
      rate: "From 4.99% APR",
      benefits: ["New & used cars", "Refinance options", "Pre-approval in minutes"],
    }
  ];

  return (
    <section className="py-24 bg-brand-muted dark:bg-brand-surface transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-primary dark:text-white transition-colors mb-6">
              Empower Your Ambitions
            </h2>
            <p className="text-lg text-brand-primary/80 dark:text-white/80">
              Whether you're buying a home, growing a business, or consolidating debt, we have the right financing solution.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loans.map((loan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-brand-secondary transition-colors rounded-3xl p-8 border border-transparent hover:border-brand-primary/10 group flex flex-col shadow-sm hover:shadow-md"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-muted dark:bg-brand-surface transition-colors shadow-sm flex items-center justify-center text-brand-primary dark:text-white mb-6">
                <loan.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-brand-primary dark:text-white transition-colors mb-2">
                {loan.title}
              </h3>
              <p className="text-brand-accent font-semibold mb-6">
                {loan.rate}
              </p>
              
              <ul className="mb-8 space-y-3 flex-grow">
                {loan.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-brand-primary/80 dark:text-white/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/30"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
              
              <button className="w-full py-3 rounded-xl bg-white dark:bg-brand-secondary transition-colors text-brand-primary dark:text-white border border-brand-primary/10 font-medium hover:bg-brand-primary hover:text-white flex justify-center items-center gap-2">
                Apply Now <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
