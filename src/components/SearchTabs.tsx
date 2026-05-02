import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BedDouble, Car, Compass, Plane, Cab, UtensilsCrossed,
  Map, Moon, FileCheck, Search, MapPin, Calendar, Users,
} from "lucide-react";

// lucide doesn't export Cab — alias
import { Car as Taxi } from "lucide-react";

const TABS = [
  { id: "stays", label: "Stays", icon: BedDouble },
  { id: "cars", label: "Car Rentals", icon: Car },
  { id: "attractions", label: "Attractions", icon: Compass },
  { id: "flights", label: "Flights", icon: Plane },
  { id: "taxi", label: "Airport Taxi", icon: Taxi },
  { id: "food", label: "Food", icon: UtensilsCrossed },
  { id: "tours", label: "Tours", icon: Map },
  { id: "nightlife", label: "Nightlife", icon: Moon },
  { id: "visas", label: "Visas", icon: FileCheck },
];

export function SearchTabs() {
  const [active, setActive] = useState("stays");

  return (
    <div className="w-full">
      {/* Tab strip */}
      <div className="mx-auto -mb-3 flex max-w-5xl gap-1 overflow-x-auto px-2 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`relative flex shrink-0 items-center gap-2 rounded-t-2xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive ? "text-primary" : "text-white/80 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-t-2xl bg-white"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10 whitespace-nowrap">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search panel */}
      <div className="rounded-3xl rounded-tl-none bg-white p-4 shadow-float sm:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]"
          >
            <Field icon={MapPin} label="Where to" placeholder="Nairobi, Maasai Mara…" />
            <Field icon={Calendar} label="Check-in" placeholder="Add dates" />
            <Field icon={Users} label="Travellers" placeholder="2 adults" />
            <button className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-brand px-6 py-4 font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] active:scale-100">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({
  icon: Icon, label, placeholder,
}: { icon: typeof MapPin; label: string; placeholder: string }) {
  return (
    <label className="group flex items-center gap-3 rounded-2xl border border-border bg-secondary/60 px-4 py-3 transition-colors focus-within:border-ocean focus-within:bg-white">
      <Icon className="h-5 w-5 text-ocean" />
      <div className="flex flex-1 flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <input
          className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}
