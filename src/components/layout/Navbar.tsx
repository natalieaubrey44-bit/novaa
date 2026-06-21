import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NovaaLogo from '../NovaaLogo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  if (location.pathname === '/dashboard') return null;

  const textColorClass = 'text-white';
  const textMutedClass = 'text-white/70';
  const borderColorClass = 'border-brand-primary/20';
  const bgColorClass = 'bg-brand-primary/95';

  const navLinks = [
    { label: 'Home',     href: '/' },
    { label: 'Personal', href: '/personal' },
    { label: 'Business', href: '/business' },
    { label: 'Loans',    href: '/loans' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      <div
        className={`transition-all duration-300 ${bgColorClass} backdrop-blur-md border-b ${borderColorClass} py-3 sm:py-4 shadow-sm shadow-slate-950/10`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <NovaaLogo
                className="text-xl text-white"
                iconSize={28}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-4 py-2 text-sm font-normal tracking-wide transition-colors relative group ${
                    isActive(link.href)
                      ? textColorClass
                      : `${textMutedClass} hover:${textColorClass}`
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
                    className={`px-4 py-2 text-sm ${textMutedClass} hover:${textColorClass} transition-colors font-normal tracking-wide`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="ml-2 px-5 py-2 rounded-sm bg-white/8 border border-white/12 text-white hover:bg-white/14 text-sm font-normal transition-all cursor-pointer tracking-wide"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-4 py-2 text-sm ${textMutedClass} hover:${textColorClass} transition-colors font-normal tracking-wide`}
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

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                ref={buttonRef}
                className={`p-2 ${textMutedClass} hover:${textColorClass} transition-colors`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`md:hidden overflow-hidden border-t ${borderColorClass} mt-3 bg-brand-primary`}
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`flex items-center px-4 py-3 text-sm rounded-sm transition-colors border-l-2 ${
                      isActive(link.href)
                        ? 'border-brand-accent text-white bg-white/6'
                        : 'border-transparent text-white/55 hover:text-white hover:bg-white/4'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {isLoggedIn ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-3 text-sm rounded-sm transition-colors border-l-2 border-transparent text-white/55 hover:text-white hover:bg-white/4"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center px-4 py-3 text-sm rounded-sm transition-colors border-l-2 border-transparent text-white/55 hover:text-white hover:bg-white/4"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-3 text-sm rounded-sm transition-colors border-l-2 border-transparent text-white/55 hover:text-white hover:bg-white/4"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center px-4 py-3 rounded-sm bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent/90 transition-colors"
                    >
                      Open Account
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}