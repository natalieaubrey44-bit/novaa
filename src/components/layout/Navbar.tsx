import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Landmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TopBanner from './TopBanner';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (location.pathname === '/dashboard') return null;

  const navLinks = [
    { label: 'Personal', href: '/personal' },
    { label: 'Business', href: '/business' },
    { label: 'Loans', href: '/loans' },
    { label: 'Investments', href: '/investments' },
    { label: 'Resources', href: '/resources' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      <TopBanner />

      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-primary/98 backdrop-blur-md border-b border-white/8 py-3'
            : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-sm bg-brand-accent flex items-center justify-center">
                <Landmark size={16} className="text-white" />
              </div>
              <span className="font-display font-semibold text-lg tracking-tight text-white">
                Nova<span className="text-brand-accent">Finance</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-4 py-2 text-sm font-normal tracking-wide transition-colors relative group ${
                    isActive(link.href)
                      ? 'text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-4 right-4 h-px bg-brand-accent" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-1">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors font-normal tracking-wide"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="ml-2 px-5 py-2 rounded-sm bg-white/8 border border-white/12 text-white text-sm font-normal hover:bg-white/14 transition-all cursor-pointer tracking-wide"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors font-normal tracking-wide"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/login"
                    className="ml-2 px-5 py-2 rounded-sm bg-brand-accent text-white text-sm font-normal hover:bg-brand-accent/90 transition-all tracking-wide"
                  >
                    Open Account
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:hidden overflow-hidden border-t border-white/8 mt-3 bg-brand-primary"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`flex items-center px-4 py-3 text-sm rounded-sm transition-colors ${
                      isActive(link.href)
                        ? 'text-white bg-white/6 border-l-2 border-brand-accent'
                        : 'text-white/55 hover:text-white hover:bg-white/4'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="pt-3 mt-3 border-t border-white/8 flex flex-col gap-2">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="px-4 py-3 text-sm text-white/60 hover:text-white transition-colors text-center rounded-sm hover:bg-white/4"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full py-3 rounded-sm bg-white/8 border border-white/10 text-white text-sm font-normal hover:bg-white/14 transition-all cursor-pointer"
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="px-4 py-3 text-sm text-white/60 hover:text-white transition-colors text-center rounded-sm hover:bg-white/4"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/login"
                        className="w-full py-3 rounded-sm bg-brand-accent text-white text-sm text-center font-normal hover:bg-brand-accent/90 transition-all"
                      >
                        Open Account
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}