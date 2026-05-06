import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { COUNTRIES } from "@/data/countries";
import {
  Sparkles, Plane, BedDouble, Car, Compass, UtensilsCrossed, Camera, Loader2, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/trip-builder")({
  head: () => ({
    meta: [
      { title: "AI Trip Builder — Roamio" },
      { name: "description", content: "Plan a complete trip with flights, stays, transport, and experiences in seconds with Roamio's AI trip builder." },
    ],
  }),
  component: TripBuilderPage,
});

const SERVICE_ICONS: Record<string, any> = {
  flights: Plane, stays: BedDouble, transport: Car,
  experiences: Sparkles, attractions: Camera, food: UtensilsCrossed,
};

type GeneratedItem = {
  service: string; title: string; location: string;
  price: string; price_unit?: string; notes: string; day: number;
};
type GeneratedTrip = {
  title: string; summary: string; country_slug: string; items: GeneratedItem[];
};

function TripBuilderPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(7);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState("mid-range");
  const [vibe, setVibe] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState<GeneratedTrip | null>(null);
  const [saving, setSaving] = useState(false);

  // Destination autocomplete
  const [destOpen, setDestOpen] = useState(false);
  const destSuggestions = destination
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(destination.toLowerCase())).slice(0, 6)
    : COUNTRIES.slice(0, 6);

  const generate = async () => {
    if (!destination.trim()) {
      toast.error("Pick a destination first");
      return;
    }
    setLoading(true);
    setTrip(null);
    try {
      const { data, error } = await supabase.functions.invoke("trip-builder", {
        body: { destination, days, travelers, budget, vibe, notes: extraNotes },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setTrip(data.trip);
    } catch (e: any) {
      toast.error(e.message ?? "Could not build trip");
    } finally {
      setLoading(false);
    }
  };

  const saveAsItinerary = async () => {
    if (!trip) return;
    if (!user) {
      toast.error("Sign in to save your trip");
      navigate({ to: "/auth" });
      return;
    }
    setSaving(true);
    try {
      const { data: itin, error } = await supabase
        .from("itineraries")
        .insert({
          user_id: user.id,
          title: trip.title,
          summary: trip.summary,
          country_slug: trip.country_slug,
        })
        .select()
        .single();
      if (error) throw error;

      const items = trip.items.map((it, idx) => ({
        itinerary_id: itin.id,
        position: idx,
        country_slug: trip.country_slug,
        service: it.service,
        listing_slug: `ai-${idx}-${it.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`,
        title: it.title,
        image: "",
        location: it.location,
        price: `${it.price}${it.price_unit ?? ""}`,
        notes: `Day ${it.day} · ${it.notes}`,
      }));
      const { error: e2 } = await supabase.from("itinerary_items").insert(items);
      if (e2) throw e2;
      toast.success("Trip saved to your itineraries");
      navigate({ to: "/itinerary/$id", params: { id: itin.id } });
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const grouped = trip
    ? trip.items.reduce<Record<number, GeneratedItem[]>>((acc, it) => {
        (acc[it.day] ??= []).push(it);
        return acc;
      }, {})
    : {};

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-28 sm:px-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          AI concierge
        </div>
        <h1 className="mt-1 text-4xl font-medium sm:text-5xl">Trip builder</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Tell us where you're going and we'll draft a complete trip — flights, stays, airport transfers, experiences, and food — in seconds.
        </p>

        <section className="mt-8 rounded-3xl bg-card p-6 shadow-soft sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="relative flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Destination</span>
              <input
                value={destination}
                onChange={(e) => { setDestination(e.target.value); setDestOpen(true); }}
                onFocus={() => setDestOpen(true)}
                onBlur={() => setTimeout(() => setDestOpen(false), 150)}
                placeholder="Type a country, e.g. Italy"
                className="rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
              {destOpen && destSuggestions.length > 0 && (
                <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-72 overflow-auto rounded-2xl border border-border bg-white shadow-float">
                  {destSuggestions.map((c) => (
                    <li key={c.slug}>
                      <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); setDestination(c.name); setDestOpen(false); }}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-muted"
                      >
                        <span className="font-medium">{c.name}</span>
                        <span className="text-xs text-muted-foreground">{c.status === "Live" ? "Live" : "Coming soon"}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Days</span>
              <input type="number" min={2} max={30} value={days} onChange={(e) => setDays(Number(e.target.value))}
                className="rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Travelers</span>
              <input type="number" min={1} max={20} value={travelers} onChange={(e) => setTravelers(Number(e.target.value))}
                className="rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Budget</span>
              <select value={budget} onChange={(e) => setBudget(e.target.value)}
                className="rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none">
                <option value="budget">Budget</option>
                <option value="mid-range">Mid-range</option>
                <option value="luxury">Luxury</option>
                <option value="ultra-luxury">Ultra-luxury</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vibe</span>
              <input value={vibe} onChange={(e) => setVibe(e.target.value)} placeholder="Beach + culture, adventure, foodie…"
                className="rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none" />
            </label>
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Extra notes</span>
              <textarea value={extraNotes} onChange={(e) => setExtraNotes(e.target.value)} rows={2}
                placeholder="Mobility needs, must-sees, dietary preferences…"
                className="rounded-2xl border border-border bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none" />
            </label>
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Building your trip…" : "Build my trip"}
          </button>
        </section>

        {trip && (
          <motion.section
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="mt-10 rounded-3xl bg-card p-6 shadow-soft sm:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-medium">{trip.title}</h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">{trip.summary}</p>
              </div>
              <button
                onClick={saveAsItinerary}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Save as itinerary
              </button>
            </div>

            <div className="mt-6 space-y-6">
              {Object.keys(grouped).map(Number).sort((a, b) => a - b).map((day) => (
                <div key={day}>
                  <div className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    Day {day}
                  </div>
                  <div className="grid gap-3">
                    {grouped[day].map((it, idx) => {
                      const Icon = SERVICE_ICONS[it.service] ?? Compass;
                      return (
                        <div key={idx} className="flex gap-4 rounded-2xl border border-border bg-white p-4">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <h3 className="font-medium">{it.title}</h3>
                              <span className="text-sm font-semibold text-primary">
                                {it.price}{it.price_unit ?? ""}
                              </span>
                            </div>
                            <div className="text-xs uppercase tracking-wider text-muted-foreground">
                              {it.service} · {it.location}
                            </div>
                            <p className="mt-1.5 text-sm text-muted-foreground">{it.notes}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Prices are AI estimates. Save as itinerary, then submit a booking request — our concierge confirms availability.
            </p>
          </motion.section>
        )}

        {!trip && !loading && (
          <p className="mt-6 text-sm text-muted-foreground">
            Already have a trip in mind? <Link to="/itinerary" className="font-semibold text-primary hover:underline">Browse your itineraries →</Link>
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
