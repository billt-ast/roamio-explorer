import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Menu,
  User,
  X,
  BedDouble,
  Camera,
  Plane,
  Sparkles,
  Car,
  UtensilsCrossed,
} from "lucide-react";
import { RoamioLogo } from "./RoamioLogo";

const services = [
  { label: "Stays", href: "/stays", Icon: BedDouble, blurb: "Tented camps, villas, city sanctuaries" },
  { label: "Attractions", href: "/attractions", Icon: Camera, blurb: "Landmarks, parks, hidden gems" },
  { label: "Flights", href: "/flights", Icon: Plane, blurb: "Domestic & regional routes" },
  { label: "Experiences", href: "/experiences", Icon: Sparkles, blurb: "Safaris, sunrise flights, trails" },
  { label: "Car Rentals", href: "/cars", Icon: Car, blurb: "4x4s, sedans, with-driver options" },
  { label: "Food", href: "/food", Icon: UtensilsCrossed, blurb: "Tastings, local trails, bookings" },
];

const links = [
  { label: "Stays", href: "#stays" },
  { label: "Experiences", href: "#experiences" },
  { label: "Flights", href: "#flights" },
  { label: "Food", href: "#food" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
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
            <a href="/" className="flex items-center gap-2">
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
              <button
                onClick={() => setOpen(true)}
                aria-label="Open services menu"
                className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-sm font-medium shadow-soft transition-all hover:shadow-float"
              >
                <Menu className="h-4 w-4" />
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-brand text-white">
                  <User className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-card shadow-float"
            >
              <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Browse
                  </div>
                  <div className="text-xl font-medium">Services</div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-10 w-10 place-items-center rounded-full bg-muted transition-colors hover:bg-accent/30"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4">
                {services.map(({ label, href, Icon, blurb }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 + i * 0.04 }}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-4 rounded-2xl px-3 py-3.5 transition-colors hover:bg-muted"
                  >
                    <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-gradient-brand text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-semibold text-foreground">
                        {label}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {blurb}
                      </span>
                    </span>
                    <span className="text-sm font-medium text-ocean opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </motion.a>
                ))}
              </nav>

              <div className="space-y-2 border-t border-border px-6 py-4">
                <a href="/trip-builder" className="block w-full rounded-full bg-gradient-brand py-3 text-center text-sm font-semibold text-white">
                  ✨ AI Trip Builder
                </a>
                <a href="/itinerary" className="block w-full rounded-full border border-border bg-white py-2.5 text-center text-sm font-semibold">
                  Open my itinerary
                </a>
                <a href="/bookings" className="block w-full rounded-full border border-border bg-white py-2.5 text-center text-sm font-semibold">
                  My bookings
                </a>
                <a href="/rewards" className="block w-full rounded-full border border-border bg-white py-2.5 text-center text-sm font-semibold">
                  ⭐ Rewards
                </a>
                <div className="flex gap-2">
                  <a href="/auth" className="flex-1 rounded-full border border-border bg-white py-2.5 text-center text-xs font-semibold">Sign in</a>
                  <a href="/admin" className="flex-1 rounded-full border border-border bg-white py-2.5 text-center text-xs font-semibold">Admin</a>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
