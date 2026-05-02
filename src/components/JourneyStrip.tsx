import { motion } from "framer-motion";
import planeImg from "@/assets/plane-coast.jpg";
import sunsetImg from "@/assets/hero-sunset.jpg";

export function JourneyStrip() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 opacity-30">
        <img src={sunsetImg} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block rounded-full bg-ocean/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-ocean">
            One platform · Every service
          </span>
          <h2 className="mt-5 text-4xl font-medium leading-[1.05] text-white sm:text-6xl">
            From the first flight to the
            last <span className="italic text-ocean">sunset</span>.
          </h2>
          <p className="mt-5 max-w-lg text-lg text-white/75">
            Roamio orchestrates accommodation, transport, food and experiences
            into a single fluid journey — with real-time pricing, bundle
            discounts and a concierge that never sleeps.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["Modular", "pricing engine"],
              ["Real-time", "orchestration"],
              ["Verified", "local partners"],
              ["Country", "by country"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-xl font-medium text-white">{k}</div>
                <div className="text-sm text-white/60">{v}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[2rem] shadow-float">
            <img
              src={planeImg}
              alt="Coastline from the air"
              className="h-[28rem] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 max-w-[16rem] rounded-2xl bg-white p-5 text-foreground shadow-float">
            <div className="text-xs font-semibold uppercase tracking-wider text-ocean">
              Bundle saving
            </div>
            <div className="mt-1 text-2xl font-semibold">
              Save up to <span className="text-gradient-brand">28%</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              when you bundle stay + safari + transfer
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
