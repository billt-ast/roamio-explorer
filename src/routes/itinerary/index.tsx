import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useItineraries, createItinerary, type Itinerary } from "@/hooks/useItinerary";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { Plus, MapPin, Trash2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/itinerary/")({
  head: () => ({
    meta: [
      { title: "My itineraries — Roamio" },
      { name: "description", content: "Build, save and manage your Roamio itineraries — stays, experiences, flights and transport in one plan." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "My itineraries — Roamio" },
      { property: "og:description", content: "Your saved Roamio trip plans." },
      { property: "og:url", content: "https://roamio-explorer.lovable.app/itinerary" },
    ],
    links: [{ rel: "canonical", href: "https://roamio-explorer.lovable.app/itinerary" }],
  }),
  component: ItineraryListPage,
});

function ItineraryListPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { itineraries, loading, refresh } = useItineraries();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (itineraries.length === 0) return;
    (async () => {
      const ids = itineraries.map((i) => i.id);
      const { data } = await supabase
        .from("itinerary_items")
        .select("itinerary_id")
        .in("itinerary_id", ids);
      const c: Record<string, number> = {};
      (data ?? []).forEach((r: any) => {
        c[r.itinerary_id] = (c[r.itinerary_id] ?? 0) + 1;
      });
      setCounts(c);
    })();
  }, [itineraries]);

  const create = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try {
      const it = await createItinerary(title.trim());
      setTitle("");
      await refresh();
      navigate({ to: "/itinerary/$id", params: { id: it.id } });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (it: Itinerary) => {
    if (!confirm(`Delete "${it.title}"?`)) return;
    const { error } = await supabase.from("itineraries").delete().eq("id", it.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      refresh();
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-28 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your trips</div>
            <h1 className="mt-1 text-4xl font-medium sm:text-5xl">Itineraries</h1>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-3xl bg-card p-5 shadow-soft sm:flex-row">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New trip name"
            maxLength={80}
            className="flex-1 rounded-full border border-border bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <button
            disabled={busy || !title.trim()}
            onClick={create}
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> Create itinerary
          </button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {loading && <p className="text-muted-foreground">Loading…</p>}
          {!loading && itineraries.length === 0 && (
            <div className="col-span-full rounded-3xl border border-dashed border-border p-10 text-center">
              <p className="text-muted-foreground">No trips yet. Browse listings and tap “Add to itinerary”.</p>
              <Link to="/" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">Explore Roamio →</Link>
            </div>
          )}
          {itineraries.map((it) => (
            <div key={it.id} className="group rounded-3xl bg-card p-6 shadow-soft transition hover:shadow-float">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-xl font-medium">{it.title}</h3>
                  {it.country_slug && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="capitalize">{it.country_slug}</span>
                    </div>
                  )}
                  <div className="mt-3 text-sm text-muted-foreground">{counts[it.id] ?? 0} items</div>
                </div>
                <button onClick={() => remove(it)} className="rounded-full p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <Link
                to="/itinerary/$id"
                params={{ id: it.id }}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
              >
                Open <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
