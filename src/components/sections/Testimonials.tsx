import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { imageSources } from '../../data/imageSources';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Eleanor Pena",
      role: "Small Business Owner",
      image: imageSources.testimonials.eleanor,
      text: "Switching to Novaa was the best decision for my bakery. The business dashboard is incredibly intuitive, and I secured a loan to expand my storefront within a week. The customer support feels truly personal.",
      rating: 5,
    },
    {
      name: "David Chen",
      role: "Tech Entrepreneur",
      image: imageSources.testimonials.david,
      text: "The integration between personal and business accounts saves me hours. The API access and virtual cards setup are perfect for a modern startup. I finally feel like my bank understands how modern businesses operate.",
      rating: 5,
    },
    {
      name: "Sarah & Mark Taylor",
      role: "First-time Homebuyers",
      image: imageSources.testimonials.sarahMark,
      text: "We were terrified of the mortgage process, but the advisors at Novaa walked us through every step. The rates were competitive, and the online portal made submitting documents a breeze. We have our dream home now!",
      rating: 5,
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((current) => (current + 1) % testimonials.length);
  const prev = () => setCurrentIndex((current) => (current - 1 + testimonials.length) % testimonials.length);

  // Auto advance
  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-brand-muted dark:bg-brand-surface transition-colors relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <Quote className="w-16 h-16 text-brand-accent/20 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-primary dark:text-white transition-colors">
            Stories From Our Clients
          </h2>
        </div>

        <div className="relative min-h-75">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
               <div className="flex gap-1 justify-center mb-6 text-brand-accent">
                 {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                   <Star key={i} size={20} fill="currentColor" />
                 ))}
               </div>
               
               <p className="text-xl md:text-2xl text-brand-primary dark:text-white transition-colors font-medium leading-relaxed mb-10 max-w-3xl">
                 "{testimonials[currentIndex].text}"
               </p>

               <div className="flex items-center gap-4">
                 <img 
                   src={testimonials[currentIndex].image} 
                   alt={testimonials[currentIndex].name} 
                   className="w-16 h-16 rounded-full object-cover border-2 border-brand-accent/20"
                 />
                 <div className="text-left">
                   <h4 className="font-bold text-brand-primary dark:text-white transition-colors">{testimonials[currentIndex].name}</h4>
                   <p className="text-sm text-brand-primary/80">{testimonials[currentIndex].role}</p>
                 </div>
               </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-4 mt-12">
          <button onClick={prev} aria-label="Previous testimonial" className="w-12 h-12 rounded-full bg-white dark:bg-brand-secondary transition-colors shadow-sm flex items-center justify-center text-brand-primary dark:text-white hover:bg-brand-primary hover:text-white border border-brand-primary/10">
            <ChevronLeft size={24} />
          </button>
          <button onClick={next} aria-label="Next testimonial" className="w-12 h-12 rounded-full bg-white dark:bg-brand-secondary transition-colors shadow-sm flex items-center justify-center text-brand-primary dark:text-white hover:bg-brand-primary hover:text-white border border-brand-primary/10">
            <ChevronRight size={24} />
          </button>
        </div>

      </div>
    </section>
  );
}
