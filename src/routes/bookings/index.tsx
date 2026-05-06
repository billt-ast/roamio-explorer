import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar, Mail, Phone, Users, ArrowRight, Hash } from "lucide-react";

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

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
  completed: "bg-sky-100 text-sky-800",
  in_review: "bg-violet-100 text-violet-800",
};

function BookingsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

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
          .select("id,title")
          .in("id", ids);
        const m: Record<string, string> = {};
        (its ?? []).forEach((i: any) => (m[i.id] = i.title));
        setTitles(m);
      }
      setLoading(false);
    })();
  }, [user]);

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

        <div className="mt-10 space-y-4">
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

          {bookings.map((b) => {
            const status = b.status || "pending";
            const badge = statusStyles[status] ?? "bg-muted text-foreground";
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
                    {status.replace("_", " ")}
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
