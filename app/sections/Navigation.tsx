import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Menu, X, Crown } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Gallery', href: '#videos' },
  { label: '3D Models', href: '#models' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-dark py-3 border-b border-white/5'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => scrollTo('#hero')}
            className="flex items-center gap-2 group"
          >
            <Crown className="w-7 h-7 text-gold transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold tracking-wider text-white">
              AW <span className="text-gold font-serif">GYMS</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm text-white/70 hover:text-gold transition-colors tracking-wide uppercase"
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/admin"
              className="text-sm px-5 py-2 border border-gold/50 text-gold hover:bg-gold hover:text-black transition-all duration-300 rounded-sm tracking-wide uppercase"
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-2xl text-white/80 hover:text-gold transition-colors tracking-wide uppercase"
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className="text-lg px-8 py-3 border border-gold text-gold hover:bg-gold hover:text-black transition-all rounded-sm tracking-wide uppercase"
          >
            Dashboard
          </Link>
        </div>
      )}
    </>
  );
}
