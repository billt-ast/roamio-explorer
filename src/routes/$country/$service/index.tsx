import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getCountry, SERVICE_LABELS, type ServiceSlug } from "@/data/countries";
import { Star, MapPin } from "lucide-react";

const SERVICES: ServiceSlug[] = ["stays", "experiences", "flights", "attractions", "food", "transport"];

export const Route = createFileRoute("/$country/$service/")({
  loader: ({ params }) => {
    const country = getCountry(params.country);
    if (!country) throw notFound();
    const service = params.service as ServiceSlug;
    if (!SERVICES.includes(service)) throw notFound();
    return { country, service, items: country.services[service] ?? [] };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${SERVICE_LABELS[loaderData.service]} in ${loaderData.country.name} — Roamio` },
          { name: "description", content: `${SERVICE_LABELS[loaderData.service]} across ${loaderData.country.name}, curated by Roamio.` },
        ]
      : [],
  }),
  notFoundComponent: () => <div className="p-12 text-center">Not found.</div>,
  errorComponent: ({ error }) => <div className="p-12 text-center">{error.message}</div>,
  component: ServiceList,
});

function ServiceList() {
  const data = Route.useLoaderData();
  const country = data.country;
  const service = data.service as ServiceSlug;
  const items = data.items as import("@/data/countries").Listing[];
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-10">
          <Link to="/$country" params={{ country: country.slug }} className="text-sm font-semibold text-primary">← {country.name}</Link>
          <h1 className="mt-3 text-4xl font-medium sm:text-5xl">{SERVICE_LABELS[service]} in {country.name}</h1>
          <p className="mt-2 text-muted-foreground">{items.length} listing{items.length === 1 ? "" : "s"} available</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-16 text-center">
            <p className="text-muted-foreground">No {SERVICE_LABELS[service].toLowerCase()} listed yet for {country.name}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((l) => (
              <Link
                key={l.id}
                to="/$country/$service/$id"
                params={{ country: country.slug, service, id: l.id }}
                className="group flex flex-col overflow-hidden rounded-3xl bg-card shadow-soft transition-shadow hover:shadow-float"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={l.image} alt={l.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {l.badge && <span className="absolute left-3 top-3 rounded-full glass-dark px-3 py-1 text-xs font-semibold text-white">{l.badge}</span>}
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold shadow-soft">
                    <Star className="h-3 w-3 fill-current text-amber-500" />{l.rating.toFixed(1)}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{l.location}</div>
                  <h3 className="mt-1.5 text-lg font-semibold">{l.title}</h3>
                  <div className="mt-3 flex items-baseline justify-between">
                    <div><span className="text-xl font-semibold text-primary">{l.price}</span>{l.priceUnit && <span className="ml-1 text-sm text-muted-foreground">{l.priceUnit}</span>}</div>
                    <span className="text-sm font-medium text-ocean">View →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
