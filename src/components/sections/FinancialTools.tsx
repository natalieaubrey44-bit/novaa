import { motion } from "motion/react";
import {
  Calculator,
  BarChart2,
  TrendingUp,
  Compass,
  ChevronRight,
} from "lucide-react";

export default function FinancialTools() {
  const tools = [
    {
      title: "Savings Calculator",
      desc: "See how fast your money can grow.",
      icon: Calculator,
    },
    {
      title: "Loan Estimator",
      desc: "Calculate your monthly payments.",
      icon: BarChart2,
    },
    {
      title: "Retirement Planner",
      desc: "Plan for a comfortable future.",
      icon: Compass,
    },
    {
      title: "Investment Projection",
      desc: "Forecast your portfolio performance.",
      icon: TrendingUp,
    },
  ];

  const barHeightClasses = [
    ["h-[20%]", "h-[35%]", "h-[55%]", "h-[80%]"],
    ["h-[30%]", "h-[45%]", "h-[60%]", "h-[82%]"],
    ["h-[40%]", "h-[55%]", "h-[65%]", "h-[84%]"],
    ["h-[50%]", "h-[65%]", "h-[70%]", "h-[86%]"],
  ];

  return (
    <section className="py-24 bg-brand-light dark:bg-brand-primary transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-primary dark:text-white transition-colors mb-6">
              Plan For Tomorrow, <br /> Today
            </h2>
            <p className="text-brand-primary/70 dark:text-white/70 transition-colors text-lg">
              Use our interactive tools to run the numbers, visualize your
              financial future, and make informed decisions.
            </p>
          </div>
          <button className="flex items-center gap-2 text-brand-accent hover:text-brand-accent/80 transition-colors font-medium">
            View All Tools <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-brand-secondary transition-colors backdrop-blur-md rounded-3xl p-8 border border-brand-primary/10 dark:border-white/10 hover:border-brand-primary/20 dark:hover:border-white/20 transition-all flex items-start gap-6 group cursor-pointer"
            >
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-brand-accent/20 flex items-center justify-center text-brand-accent group-hover:scale-110 transition-transform">
                <tool.icon size={32} />
              </div>
              <div className="grow">
                <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                <p className="text-brand-light/60 text-sm mb-6">{tool.desc}</p>

                {/* Mini mock chart/UI */}
                <div className="w-full h-16 bg-white/5 rounded-lg flex items-end px-4 gap-2 pb-2">
                  <div className={`w-full ${barHeightClasses[i][0]} bg-brand-accent/40 rounded-t-sm`}></div>
                  <div className={`w-full ${barHeightClasses[i][1]} bg-brand-accent/60 rounded-t-sm`}></div>
                  <div className={`w-full ${barHeightClasses[i][2]} bg-brand-accent/80 rounded-t-sm`}></div>
                  <div className={`w-full ${barHeightClasses[i][3]} bg-brand-accent rounded-t-sm`}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
