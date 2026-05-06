import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar, Mail, Phone, Users, ArrowRight, Hash, Search, X, MapPin } from "lucide-react";
import { COUNTRIES } from "@/data/countries";

export const Route = createFileRoute("/bookings/")({
  head: () => ({ meta: [{ title: "My bookings — Roamio" }] }),
  component: BookingsPage,
});

type Booking = {
  id: string;
  itinerary_id: string;
  status: string;
  full_name: string;
  email: string;
  phone: string | null;
  travelers: number;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  admin_reference: string | null;
  admin_summary: string | null;
  created_at: string;
  updated_at: string;
};

type ItinMeta = { title: string; country_slug: string | null };

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
  completed: "bg-sky-100 text-sky-800",
  in_review: "bg-violet-100 text-violet-800",
};

const STATUS_OPTIONS = ["all", "pending", "in_review", "confirmed", "completed", "cancelled"];

function BookingsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [itinMeta, setItinMeta] = useState<Record<string, ItinMeta>>({});
  const [loading, setLoading] = useState(true);

  // filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [country, setCountry] = useState<string>("all");
  const [countryQuery, setCountryQuery] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("booking_requests")
        .select("*")
        .order("created_at", { ascending: false });
      const list = (data as Booking[]) ?? [];
      setBookings(list);
      const ids = [...new Set(list.map((b) => b.itinerary_id))];
      if (ids.length) {
        const { data: its } = await supabase
          .from("itineraries")
          .select("id,title,country_slug")
          .in("id", ids);
        const m: Record<string, ItinMeta> = {};
        (its ?? []).forEach((i: any) => (m[i.id] = { title: i.title, country_slug: i.country_slug }));
        setItinMeta(m);
      }
      setLoading(false);
    })();
  }, [user]);

  const countries = useMemo(() => {
    const set = new Set<string>();
    Object.values(itinMeta).forEach((m) => m.country_slug && set.add(m.country_slug));
    return [...set].sort();
  }, [itinMeta]);

  const countryLabel = (slug: string) =>
    COUNTRIES.find((c) => c.slug === slug)?.name ?? slug;

  const countrySuggestions = useMemo(() => {
    const needle = countryQuery.trim().toLowerCase();
    const list = countries.map((slug) => ({ slug, name: countryLabel(slug) }));
    if (!needle) return list;
    return list.filter((c) =>
      c.name.toLowerCase().includes(needle) || c.slug.includes(needle),
    );
  }, [countries, countryQuery]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return bookings.filter((b) => {
      const meta = itinMeta[b.itinerary_id];
      if (status !== "all" && (b.status || "pending") !== status) return false;
      if (country !== "all" && meta?.country_slug !== country) return false;
      if (from && b.start_date && b.start_date < from) return false;
      if (to && b.end_date && b.end_date > to) return false;
      if (from && !b.start_date) return false;
      if (to && !b.end_date) return false;
      if (needle) {
        const hay = `${meta?.title ?? ""} ${b.full_name} ${b.admin_reference ?? ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [bookings, itinMeta, q, status, country, from, to]);

  const titles = useMemo(() => {
    const t: Record<string, string> = {};
    Object.entries(itinMeta).forEach(([k, v]) => (t[k] = v.title));
    return t;
  }, [itinMeta]);

  const reset = () => {
    setQ("");
    setStatus("all");
    setCountry("all");
    setFrom("");
    setTo("");
  };
  const hasFilters = q || status !== "all" || country !== "all" || from || to;


  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-28 sm:px-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Concierge
        </div>
        <h1 className="mt-1 text-4xl font-medium sm:text-5xl">My bookings</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Track the status of every booking request you've submitted. Our concierge team will reply
          here with reference numbers and trip summaries.
        </p>

        {/* Filters */}
        <div className="mt-8 rounded-3xl bg-card p-4 shadow-soft sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <label className="relative sm:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by trip, name, or reference"
                className="w-full rounded-full border border-border bg-white py-2.5 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
              />
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-full border border-border bg-white px-4 py-2.5 text-sm capitalize focus:border-primary focus:outline-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All statuses" : s.replace("_", " ")}
                </option>
              ))}
            </select>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-full border border-border bg-white px-4 py-2.5 text-sm capitalize focus:border-primary focus:outline-none"
            >
              <option value="all">All destinations</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-full border border-border bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                aria-label="From date"
              />
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-full border border-border bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                aria-label="To date"
              />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {filtered.length} of {bookings.length}
            </span>
            {hasFilters && (
              <button
                onClick={reset}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 font-semibold text-foreground hover:bg-muted"
              >
                <X className="h-3 w-3" /> Reset
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {loading && <p className="text-muted-foreground">Loading…</p>}
          {!loading && bookings.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border p-10 text-center">
              <p className="text-muted-foreground">
                No booking requests yet. Build an itinerary, then send it to the concierge.
              </p>
              <Link
                to="/itinerary"
                className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
              >
                Go to itineraries →
              </Link>
            </div>
          )}
          {!loading && bookings.length > 0 && filtered.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">
              No bookings match these filters.
            </div>
          )}

          {filtered.map((b) => {
            const st = b.status || "pending";
            const badge = statusStyles[st] ?? "bg-muted text-foreground";
            return (
              <article key={b.id} className="rounded-3xl bg-card p-6 shadow-soft">
                <header className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-medium">
                      {titles[b.itinerary_id] ?? "Trip request"}
                    </h2>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Submitted {new Date(b.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${badge}`}
                  >
                    {st.replace("_", " ")}
                  </span>
                </header>

                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" /> {b.travelers} traveler
                    {b.travelers === 1 ? "" : "s"}
                  </div>
                  {(b.start_date || b.end_date) && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {b.start_date ?? "?"} → {b.end_date ?? "?"}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" /> {b.email}
                  </div>
                  {b.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" /> {b.phone}
                    </div>
                  )}
                </div>

                {b.notes && (
                  <p className="mt-4 rounded-2xl bg-muted/40 p-4 text-sm text-muted-foreground">
                    {b.notes}
                  </p>
                )}

                {(b.admin_reference || b.admin_summary) && (
                  <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Concierge response
                    </div>
                    {b.admin_reference && (
                      <div className="mt-2 flex items-center gap-2 text-sm font-medium">
                        <Hash className="h-4 w-4" /> Ref: {b.admin_reference}
                      </div>
                    )}
                    {b.admin_summary && (
                      <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">
                        {b.admin_summary}
                      </p>
                    )}
                    <div className="mt-2 text-xs text-muted-foreground">
                      Updated {new Date(b.updated_at).toLocaleString()}
                    </div>
                  </div>
                )}

                <Link
                  to="/itinerary/$id"
                  params={{ id: b.itinerary_id }}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                >
                  View itinerary <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
