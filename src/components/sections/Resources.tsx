import { motion } from 'motion/react';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function Resources() {
  const articles = [
    {
      category: "Investing",
      title: "How to Build a Diversified Portfolio in 2024",
      summary: "Understand the core components of asset allocation to weather market volatility.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Real Estate",
      title: "First-Time Homebuyer's Complete Guide",
      summary: "Everything you need to know from pre-approval to the final closing signature.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop",
    },
    {
      category: "Small Business",
      title: "Optimizing Cash Flow for Seasonal Operations",
      summary: "Strategic approaches to managing inventory and payroll during off-peak months.",
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=800&auto=format&fit=crop",
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-brand-secondary transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-brand-accent font-semibold mb-4 text-sm tracking-wide uppercase">
              <BookOpen size={18} /> Financial Education
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-primary dark:text-white transition-colors">Latest Resources</h2>
          </div>
          <button className="text-brand-primary dark:text-white transition-colors font-medium hover:text-brand-accent flex items-center gap-2 pb-2">
            View All Articles <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-brand-primary/20 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-brand-primary dark:text-white transition-colors shadow-sm">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-brand-primary dark:text-white transition-colors mb-3 group-hover:text-brand-accent">
                {article.title}
              </h3>
              <p className="text-brand-primary/80 dark:text-white/80 text-sm leading-relaxed mb-4 flex-grow">
                {article.summary}
              </p>
              
              <span className="text-brand-accent text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Read Article <ArrowRight size={16} />
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
