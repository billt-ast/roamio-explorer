import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import type { ReactNode } from "react";

export type PreviewCard = {
  image: string;
  title: string;
  location: string;
  price: string;
  priceUnit?: string;
  rating: number;
  badge?: string;
};

export function CategoryRow({
  eyebrow, title, description, cards, action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  cards: PreviewCard[];
  action?: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </span>
          <h2 className="mt-4 text-4xl font-medium leading-[1.05] sm:text-5xl">
            {title}
          </h2>
          <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
            {description}
          </p>
        </div>
        {action}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => (
          <motion.article
            key={c.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className="group cursor-pointer overflow-hidden rounded-3xl bg-card shadow-soft transition-shadow hover:shadow-float"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={c.image}
                alt={c.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {c.badge && (
                <span className="absolute left-3 top-3 rounded-full glass-dark px-3 py-1 text-xs font-semibold text-white">
                  {c.badge}
                </span>
              )}
              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-foreground shadow-soft">
                <Star className="h-3 w-3 fill-current text-amber-500" />
                {c.rating.toFixed(1)}
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {c.location}
              </div>
              <h3 className="mt-1.5 text-lg font-semibold text-foreground">
                {c.title}
              </h3>
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-semibold text-primary">{c.price}</span>
                  {c.priceUnit && (
                    <span className="ml-1 text-sm text-muted-foreground">{c.priceUnit}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-ocean transition-transform group-hover:translate-x-1">
                  View →
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
