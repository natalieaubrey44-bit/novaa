import { Link, useLocation } from 'react-router-dom';
import { Landmark, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';
import NovaaLogo from '../NovaaLogo';

export default function Footer() {
  const location = useLocation();

  if (location.pathname === '/dashboard') {
    return null;
  }

  const footerLinks = {
    Products: ['Checking', 'Savings', 'Credit Cards', 'Loans', 'Mortgages'],
    Company: ['About Us', 'Careers', 'Press', 'Investors', 'Community'],
    Resources: ['Help Center', 'Financial Guides', 'Security', 'Rates', 'Branch Locator'],
    Support: ['Contact Us', 'Fraud Department', 'Lost Card', 'Accessibility'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Licenses'],
  };

  return (
    <footer className="bg-brand-navy text-white pt-20 pb-10 border-t border-brand-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hide large footer sections on open-account and login pages */}
        {!(location.pathname === '/open-account' || location.pathname === '/login') && (
          <>
            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
              {/* Brand & Newsletter */}
              <div className="lg:col-span-2 space-y-6">
                <Link to="/" className="flex items-center group">
                  <NovaaLogo className="text-3xl text-white" iconSize={36} />
                </Link>
                <p className="text-white/70 text-sm leading-relaxed max-w-sm font-medium">
                  Empowering your financial journey with modern tools, exceptional security, and a premium banking experience tailored for your future.
                </p>

                <div className="pt-4">
                  <h4 className="text-sm font-bold text-white mb-3">Subscribe to our newsletter</h4>
                  <form className="flex gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="flex-1 bg-white/10 text-white rounded-lg px-4 py-2.5 text-sm border border-white/20 focus:outline-none focus:border-brand-accent transition-colors placeholder:text-white/40"
                      required
                    />
                    <button type="submit" className="bg-brand-accent hover:bg-brand-accent/90 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer">
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>

              {/* Links Columns */}
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h4 className="font-bold text-white mb-5 font-display tracking-wide uppercase text-xs">{category}</h4>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-white/60 hover:text-brand-accent text-sm font-semibold transition-colors block">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-xs text-center md:text-left font-semibold">
            &copy; {new Date().getFullYear()} Novaa Inc. All rights reserved. <br className="md:hidden" />
            <span className="inline-block mt-2 md:mt-0 md:ml-2">Member FDIC. Equal Housing Lender.</span>
          </p>
          
          <div className="flex gap-4">
            {[
              { Icon: Twitter, label: 'Twitter' },
              { Icon: Linkedin, label: 'LinkedIn' },
              { Icon: Instagram, label: 'Instagram' },
              { Icon: Facebook, label: 'Facebook' },
            ].map(({ Icon, label }, i) => (
              <a
                key={i}
                href="#"
                aria-label={label}
                title={label}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/80 border border-white/10 hover:bg-brand-accent hover:text-white transition-all"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
        
      </div>
    </footer>
  );
}
