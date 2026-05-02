import { motion } from "framer-motion";
import japan from "@/assets/dest-japan.jpg";
import zen from "@/assets/dest-zen.jpg";
import singapore from "@/assets/dest-singapore.jpg";
import rio from "@/assets/dest-rio.jpg";
import egypt from "@/assets/dest-egypt.jpg";
import petra from "@/assets/dest-petra.jpg";

const dests = [
  { name: "Japan", tag: "Coming soon", img: japan },
  { name: "Singapore", tag: "Coming soon", img: singapore },
  { name: "Brazil", tag: "Coming soon", img: rio },
  { name: "Egypt", tag: "Coming soon", img: egypt },
  { name: "Jordan", tag: "Coming soon", img: petra },
  { name: "Kyoto", tag: "Coming soon", img: zen },
];

export function Destinations() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6">
      <div className="mb-12 max-w-2xl">
        <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          The world is next
        </span>
        <h2 className="mt-4 text-4xl font-medium leading-[1.05] sm:text-5xl">
          Built for Kenya. <span className="text-gradient-brand">Designed for the world.</span>
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          We're scaling country by country — bringing the same fluid explorer
          experience to every corner of the map.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {dests.map((d, i) => (
          <motion.div
            key={d.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl shadow-soft"
          >
            <img
              src={d.img}
              alt={d.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="text-xs font-medium text-ocean">{d.tag}</div>
              <div className="text-xl font-semibold text-white">{d.name}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
