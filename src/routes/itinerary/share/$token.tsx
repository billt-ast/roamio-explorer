import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, Loader2 } from "lucide-react";
import type { Itinerary, ItineraryItem } from "@/hooks/useItinerary";

export const Route = createFileRoute("/itinerary/share/$token")({
  head: () => ({ meta: [{ title: "Shared itinerary — Roamio" }] }),
  component: SharePage,
});

function SharePage() {
  const { token } = Route.useParams();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: it } = await supabase
        .from("itineraries")
        .select("*")
        .eq("share_token", token)
        .eq("is_public", true)
        .maybeSingle();
      if (it) {
        const { data: itms } = await supabase
          .from("itinerary_items")
          .select("*")
          .eq("itinerary_id", (it as Itinerary).id)
          .order("position");
        setItinerary(it as Itinerary);
        setItems((itms as ItineraryItem[]) ?? []);
      }
      setLoading(false);
    })();
  }, [token]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  if (!itinerary) {
    return (
      <div className="min-h-screen"><Navbar />
        <main className="mx-auto max-w-3xl px-6 py-32 text-center">
          <h1 className="text-3xl font-medium">This itinerary is private</h1>
          <p className="mt-2 text-muted-foreground">The link may be expired or the owner made it private.</p>
          <Link to="/" className="mt-6 inline-block text-primary">Explore Roamio →</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-28 sm:px-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shared trip</div>
        <h1 className="mt-1 text-4xl font-medium sm:text-5xl">{itinerary.title}</h1>
        {itinerary.summary && <p className="mt-3 text-muted-foreground">{itinerary.summary}</p>}

        <div className="mt-8 space-y-3">
          {items.map((it, i) => (
            <Link
              key={it.id}
              to="/$country/$service/$id"
              params={{ country: it.country_slug, service: it.service, id: it.listing_slug }}
              className="flex gap-4 rounded-3xl bg-card p-3 shadow-soft transition hover:shadow-float sm:p-4"
            >
              <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-gradient-brand text-sm font-semibold text-white">{i + 1}</div>
              <img src={it.image} alt={it.title} className="h-24 w-24 flex-shrink-0 rounded-2xl object-cover sm:h-28 sm:w-36" />
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{it.service}</div>
                <h3 className="truncate text-base font-medium sm:text-lg">{it.title}</h3>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {it.location}</div>
                <div className="mt-1 text-sm font-semibold text-primary">{it.price}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-3xl bg-gradient-brand p-6 text-white shadow-float">
          <h2 className="text-xl font-medium">Want a trip like this?</h2>
          <p className="mt-1 text-sm opacity-90">Sign up to copy and customize this itinerary.</p>
          <Link to="/auth" className="mt-4 inline-block rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary">Get started</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
