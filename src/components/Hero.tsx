import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { SearchTabs } from "./SearchTabs";
import heroKenya from "@/assets/hero-kenya.jpg";
import heroSunset from "@/assets/hero-sunset.jpg";
import stayLoft from "@/assets/stay-aesthetic-loft.jpg";
import stayBalcony from "@/assets/stay-urban-balcony.jpg";
import stayRooftop from "@/assets/stay-rooftop-lights.jpg";

const slides = [
  { src: heroKenya, alt: "Kenya savanna at golden hour" },
  { src: stayLoft, alt: "Aesthetic boho living room stay" },
  { src: heroSunset, alt: "Coastal sunset over Diani" },
  { src: stayBalcony, alt: "Urban balcony retreat at dusk" },
  { src: stayRooftop, alt: "Rooftop terrace with string lights" },
];

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % slides.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <AnimatePresence mode="sync">
          <motion.img
            key={i}
            src={slides[i].src}
            alt={slides[i].alt}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-hero-veil" />
      </div>

      <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-10 pt-32 sm:px-6 sm:pb-16 sm:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs font-medium text-white"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ocean opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ocean" />
          </span>
          <MapPin className="h-3.5 w-3.5" />
          Kenya Explorer Mode active
        </motion.div>

        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.5fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-5xl font-medium leading-[0.95] text-white sm:text-7xl lg:text-[5.5rem]">
              Explore Kenya
              <br />
              <span className="italic text-white/90">like never before.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85 sm:text-xl">
              Stays, safaris, flights, food, transport — orchestrated into one
              fluid journey. Built for the modern explorer.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button className="group flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-primary shadow-float transition-transform hover:scale-[1.03]">
                Plan your trip
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20">
                <Sparkles className="h-4 w-4" />
                Explore experiences
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <Stat value="180+" label="Curated stays across Kenya" />
            <Stat value="40" label="Verified safari operators" />
            <Stat value="24/7" label="On-trip concierge" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 sm:mt-14"
        >
          <SearchTabs />
        </motion.div>

        {/* Slide indicators */}
        <div className="mt-8 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === i ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-white/30 py-2 pl-4">
      <div className="text-3xl font-medium text-white">{value}</div>
      <div className="text-xs uppercase tracking-wider text-white/70">{label}</div>
    </div>
  );
}
