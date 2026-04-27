import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Menu, X, Shield } from "lucide-react";

const navLinks = [
  { label: "PROTOCOL", href: "#atmosphere" },
  { label: "INTELLIGENCE", href: "#intelligence" },
  { label: "ARSENAL", href: "#arsenal" },
  { label: "NEXUS", href: "#nexus" },
];

export default function Navigation() {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-glass border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white font-heading font-bold text-lg tracking-wider">
            <Dumbbell className="w-5 h-5 text-cyber" />
            AW GYMS
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-mono text-platinum hover:text-cyber transition-colors tracking-widest"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-xs font-mono text-platinum hover:text-cyber transition-colors tracking-widest"
            >
              <Shield className="w-3 h-3" />
              ADMIN
            </Link>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-industrial border-b border-white/10 md:hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-mono text-platinum hover:text-cyber transition-colors tracking-widest"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/admin"
                className="flex items-center gap-2 text-sm font-mono text-platinum hover:text-cyber transition-colors tracking-widest"
                onClick={() => setMobileOpen(false)}
              >
                <Shield className="w-4 h-4" />
                ADMIN PANEL
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
