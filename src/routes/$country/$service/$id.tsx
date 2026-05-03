import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getCountry, getListing, SERVICE_LABELS, type ServiceSlug } from "@/data/countries";
import { Star, MapPin } from "lucide-react";

const SERVICES: ServiceSlug[] = ["stays", "experiences", "flights", "attractions", "food", "transport"];

export const Route = createFileRoute("/$country/$service/$id")({
  loader: ({ params }) => {
    const country = getCountry(params.country);
    if (!country) throw notFound();
    if (!SERVICES.includes(params.service as ServiceSlug)) throw notFound();
    const service = params.service as ServiceSlug;
    const listing = getListing(params.country, service, params.id);
    if (!listing) throw notFound();
    return { country, service, listing };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.listing.title} — ${loaderData.country.name} | Roamio` },
          { name: "description", content: loaderData.listing.description },
          { property: "og:title", content: loaderData.listing.title },
          { property: "og:description", content: loaderData.listing.description },
          { property: "og:image", content: loaderData.listing.image },
        ]
      : [],
  }),
  notFoundComponent: () => <div className="p-12 text-center">Listing not found.</div>,
  errorComponent: ({ error }) => <div className="p-12 text-center">{error.message}</div>,
  component: ListingDetail,
});

function ListingDetail() {
  const { country, service, listing } = Route.useLoaderData();
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link to="/$country" params={{ country: country.slug }} className="hover:text-primary">{country.name}</Link>
          <span>/</span>
          <Link to="/$country/$service" params={{ country: country.slug, service }} className="hover:text-primary">{SERVICE_LABELS[service]}</Link>
          <span>/</span>
          <span className="text-foreground">{listing.title}</span>
        </nav>

        <div className="overflow-hidden rounded-[2rem] shadow-float">
          <img src={listing.image} alt={listing.title} className="h-[60vh] w-full object-cover" />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{listing.location}</div>
            <h1 className="mt-2 text-4xl font-medium sm:text-5xl">{listing.title}</h1>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 fill-current text-amber-500" />
              <span className="font-semibold">{listing.rating.toFixed(2)}</span>
              <span className="text-muted-foreground">· Verified by Roamio hosts</span>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{listing.description}</p>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {["Concierge orchestration", "Flexible reschedule", "Local host on-call", "Roamio price match", "Stripe + M-Pesa", "Itinerary-ready"].map((p) => (
                <div key={p} className="rounded-2xl bg-card p-4 text-sm font-medium shadow-soft">{p}</div>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-3xl bg-card p-6 shadow-float lg:sticky lg:top-24">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-primary">{listing.price}</span>
              {listing.priceUnit && <span className="text-sm text-muted-foreground">{listing.priceUnit}</span>}
            </div>
            <button className="mt-5 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:shadow-float">Add to itinerary</button>
            <button className="mt-3 w-full rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground">Reserve now</button>
            <p className="mt-4 text-xs text-muted-foreground">No charge yet — Roamio holds your spot for 24h.</p>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
