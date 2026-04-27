import { Crown, Instagram, Facebook, Youtube, Twitter, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';

const links = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Gallery', href: '#videos' },
  { label: '3D Models', href: '#models' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black border-t border-white/5 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Crown className="w-8 h-8 text-gold" />
              <span className="text-2xl font-bold tracking-wider text-white">
                AW <span className="text-gold font-serif">GYMS</span>
              </span>
            </div>
            <p className="text-white/40 max-w-md leading-relaxed mb-6">
              Where luxury meets performance. AW Gyms is Pakistan's premier fitness destination,
              offering world-class equipment, expert training, and an environment designed for excellence.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-white/5 flex items-center justify-center text-white/40 hover:bg-gold hover:text-black transition-all rounded-sm"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-6 tracking-wider uppercase text-sm">Navigation</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-white/40 hover:text-gold transition-colors flex items-center gap-1 text-sm"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin */}
          <div>
            <h4 className="text-white font-medium mb-6 tracking-wider uppercase text-sm">Management</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/admin"
                  className="text-white/40 hover:text-gold transition-colors flex items-center gap-1 text-sm"
                >
                  Admin Dashboard
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/923497814918"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-gold transition-colors flex items-center gap-1 text-sm"
                >
                  WhatsApp Sales
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            &copy; {new Date().getFullYear()} AW Gyms. All rights reserved.
          </p>
          <p className="text-white/30 text-sm">
            Designed with precision. Built for champions.
          </p>
        </div>
      </div>
    </footer>
  );
}
