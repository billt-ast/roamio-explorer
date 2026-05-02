import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Menu, User } from "lucide-react";
import { RoamioLogo } from "./RoamioLogo";

const links = [
  { label: "Stays", href: "#stays" },
  { label: "Experiences", href: "#experiences" },
  { label: "Flights", href: "#flights" },
  { label: "Food", href: "#food" },
  { label: "Hosts", href: "#hosts" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={`flex items-center justify-between rounded-full border border-white/40 px-4 py-2.5 transition-all duration-500 sm:px-6 ${
            scrolled ? "glass shadow-soft" : "bg-white/30 backdrop-blur-md"
          }`}
        >
          <a href="#" className="flex items-center gap-2">
            <RoamioLogo />
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="relative rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-white/60 sm:flex">
              <Globe className="h-4 w-4" />
              <span>KE</span>
            </button>
            <button className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium shadow-soft transition-all hover:shadow-float">
              <Menu className="h-4 w-4" />
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-brand text-white">
                <User className="h-3.5 w-3.5" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
