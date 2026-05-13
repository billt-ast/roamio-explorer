import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CategoryRow } from "@/components/CategoryRow";
import { getCountry, SERVICE_LABELS, type ServiceSlug } from "@/data/countries";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/$country/")({
  loader: ({ params }) => {
    const country = getCountry(params.country);
    if (!country) throw notFound();
    return { country };
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.country.name} — Roamio` },
          { name: "description", content: loaderData.country.tagline },
          { property: "og:title", content: `${loaderData.country.name} — Roamio` },
          { property: "og:description", content: loaderData.country.tagline },
          { property: "og:image", content: loaderData.country.hero },
          { property: "og:url", content: `https://roamio-explorer.lovable.app/${params.country}` },
        ]
      : [],
    links: [{ rel: "canonical", href: `https://roamio-explorer.lovable.app/${params.country}` }],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-semibold">Country not yet live</h1>
        <Link to="/" className="mt-4 inline-block text-primary underline">Back home</Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-12 text-center">{error.message}</div>
  ),
  component: CountryHub,
});

function CountryHub() {
  const { country } = Route.useLoaderData();
  const services = Object.keys(country.services) as ServiceSlug[];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
          <img src={country.hero} alt={country.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />
          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:px-6">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ocean">{country.status === "Live" ? "Live in country" : "Coming soon"}</span>
            <h1 className="mt-3 text-5xl font-medium leading-[1.05] text-white sm:text-7xl">{country.name}</h1>
            <p className="mt-4 max-w-xl text-lg text-white/80">{country.tagline}</p>
          </div>
        </section>

        {services.length === 0 && (
          <div className="mx-auto max-w-3xl px-6 py-24 text-center">
            <h2 className="text-3xl font-medium">Listings landing soon</h2>
            <p className="mt-3 text-muted-foreground">{country.name} is being onboarded by our local hosts.</p>
          </div>
        )}

        {services.map((s) => {
          const items = (country.services[s] ?? []) as import("@/data/countries").Listing[];
          return (
            <CategoryRow
              key={s}
              eyebrow={`${country.name} · ${SERVICE_LABELS[s]}`}
              title={`${SERVICE_LABELS[s]} in ${country.name}`}
              description={`Curated ${SERVICE_LABELS[s].toLowerCase()} across ${country.name}, vetted by Roamio hosts.`}
              cards={items.map((l) => ({
                image: l.image, title: l.title, location: l.location,
                price: l.price, priceUnit: l.priceUnit, rating: l.rating, badge: l.badge,
                href: `/${country.slug}/${s}/${l.id}`,
              }))}
              viewAllHref={`/${country.slug}/${s}`}
              viewAllLabel={`View all ${SERVICE_LABELS[s].toLowerCase()}`}
            />
          );
        })}

        <div className="mx-auto max-w-7xl px-6 pb-24">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <ArrowRight className="h-4 w-4 rotate-180" /> Back to all countries
          </Link>
        </div>
        <Footer />
      </main>
    </div>
  );
}
