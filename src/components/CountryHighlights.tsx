import { motion } from "framer-motion";
import kenya from "@/assets/hero-kenya.jpg";
import italy from "@/assets/dest-italy.jpg";
import croatia from "@/assets/dest-croatia.jpg";
import montenegro from "@/assets/dest-montenegro.jpg";
import egypt from "@/assets/dest-egypt.jpg";
import japan from "@/assets/dest-japan.jpg";

const countries = [
  { name: "Kenya", slug: "kenya", img: kenya, status: "Live" },
  { name: "Italy", slug: "italy", img: italy, status: "Soon" },
  { name: "Croatia", slug: "croatia", img: croatia, status: "Soon" },
  { name: "Montenegro", slug: "montenegro", img: montenegro, status: "Soon" },
  { name: "Egypt", slug: "egypt", img: egypt, status: "Soon" },
  { name: "Japan", slug: "japan", img: japan, status: "Soon" },
];

export function CountryHighlights() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-4 pt-16 sm:px-6 sm:pt-20">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Country highlights
          </span>
          <h2 className="mt-3 text-2xl font-medium sm:text-3xl">
            Pick a country, jump in.
          </h2>
        </div>
      </div>

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
        {countries.map((c, i) => (
          <motion.a
            key={c.slug}
            href={`/${c.slug}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            whileHover={{ y: -3 }}
            className="group relative aspect-[3/4] w-32 flex-shrink-0 overflow-hidden rounded-2xl shadow-soft sm:w-auto"
          >
            <img
              src={c.img}
              alt={c.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-ocean">
                {c.status}
              </div>
              <div className="text-base font-semibold text-white">{c.name}</div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
