import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Trash2,
  Share2,
  Globe,
  Lock,
  Send,
  MapPin,
  Loader2,
} from "lucide-react";
import type { Itinerary, ItineraryItem } from "@/hooks/useItinerary";

export const Route = createFileRoute("/itinerary/$id")({
  head: () => ({ meta: [{ title: "Itinerary — Roamio" }] }),
  component: ItineraryDetailPage,
});

function ItineraryDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth" });
  }, [authLoading, user, navigate]);

  const load = async () => {
    setLoading(true);
    const [{ data: it }, { data: itms }] = await Promise.all([
      supabase.from("itineraries").select("*").eq("id", id).maybeSingle(),
      supabase.from("itinerary_items").select("*").eq("itinerary_id", id).order("position"),
    ]);
    setItinerary((it as Itinerary) ?? null);
    setItems((itms as ItineraryItem[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) load();
  }, [id, user]);

  const move = async (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const a = items[idx];
    const b = items[j];
    const next = [...items];
    next[idx] = { ...b, position: idx };
    next[j] = { ...a, position: j };
    setItems(next);
    await Promise.all([
      supabase.from("itinerary_items").update({ position: j }).eq("id", a.id),
      supabase.from("itinerary_items").update({ position: idx }).eq("id", b.id),
    ]);
  };

  const removeItem = async (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    await supabase.from("itinerary_items").delete().eq("id", itemId);
  };

  const togglePublic = async () => {
    if (!itinerary) return;
    const next = !itinerary.is_public;
    setItinerary({ ...itinerary, is_public: next });
    await supabase.from("itineraries").update({ is_public: next }).eq("id", itinerary.id);
    toast.success(next ? "Itinerary is now shareable" : "Itinerary is private");
  };

  const copyShare = async () => {
    if (!itinerary) return;
    const url = `${window.location.origin}/itinerary/share/${itinerary.share_token}`;
    await navigator.clipboard.writeText(url);
    toast.success("Share link copied");
  };

  const updateTitle = async (title: string) => {
    if (!itinerary) return;
    setItinerary({ ...itinerary, title });
    await supabase.from("itineraries").update({ title }).eq("id", itinerary.id);
  };

  if (loading || authLoading) {
    return (
      <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen"><Navbar />
        <main className="mx-auto max-w-3xl px-6 py-32 text-center">
          <h1 className="text-3xl font-medium">Itinerary not found</h1>
          <Link to="/itinerary" className="mt-4 inline-block text-primary">Back to itineraries</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-28 sm:px-6">
        <Link to="/itinerary" className="text-sm text-muted-foreground hover:text-primary">← All itineraries</Link>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <input
            value={itinerary.title}
            onChange={(e) => setItinerary({ ...itinerary, title: e.target.value })}
            onBlur={(e) => updateTitle(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-4xl font-medium outline-none focus:border-b focus:border-primary sm:text-5xl"
          />
          <div className="flex flex-wrap gap-2">
            <button onClick={togglePublic} className="flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold">
              {itinerary.is_public ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
              {itinerary.is_public ? "Public" : "Private"}
            </button>
            <button onClick={copyShare} disabled={!itinerary.is_public} className="flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background disabled:opacity-40">
              <Share2 className="h-3.5 w-3.5" /> Copy share link
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {items.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">
              No items yet. Browse listings and tap “Add to itinerary”.
            </div>
          )}
          {items.map((it, idx) => (
            <div key={it.id} className="flex gap-4 rounded-3xl bg-card p-3 shadow-soft sm:p-4">
              <Link
                to="/$country/$service/$id"
                params={{ country: it.country_slug, service: it.service, id: it.listing_slug }}
                className="block h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-36"
              >
                <img src={it.image} alt={it.title} className="h-full w-full object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{it.service}</div>
                <h3 className="truncate text-base font-medium sm:text-lg">{it.title}</h3>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {it.location}
                </div>
                <div className="mt-1 text-sm font-semibold text-primary">{it.price}</div>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => move(idx, -1)} disabled={idx === 0} className="rounded-full p-1.5 hover:bg-muted disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="rounded-full p-1.5 hover:bg-muted disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                <button onClick={() => removeItem(it.id)} className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="mt-10 rounded-3xl bg-gradient-brand p-6 text-white shadow-float sm:p-8">
            <h2 className="text-2xl font-medium">Ready to book this trip?</h2>
            <p className="mt-2 text-sm opacity-90">Send one request — Roamio orchestrates transport, accommodation, and experiences in your itinerary.</p>
            <button
              onClick={() => setShowBooking(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary"
            >
              <Send className="h-4 w-4" /> Request booking
            </button>
          </div>
        )}

        {showBooking && itinerary && user && (
          <BookingDialog
            itineraryId={itinerary.id}
            userId={user.id}
            defaultEmail={user.email ?? ""}
            onClose={() => setShowBooking(false)}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

function BookingDialog({
  itineraryId,
  userId,
  defaultEmail,
  onClose,
}: {
  itineraryId: string;
  userId: string;
  defaultEmail: string;
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("booking_requests").insert({
      user_id: userId,
      itinerary_id: itineraryId,
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      travelers,
      start_date: startDate || null,
      end_date: endDate || null,
      notes: notes.trim(),
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Booking request sent — our concierge will reach out shortly.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/60 p-4 backdrop-blur-sm sm:items-center">
      <form onSubmit={submit} className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-float">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">One request</div>
            <h3 className="text-xl font-medium">Book this itinerary</h3>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">Close</button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Field label="Full name" required>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={120} required className="input" />
          </Field>
          <Field label="Email" required>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} required className="input" />
          </Field>
          <Field label="Phone">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={32} className="input" />
          </Field>
          <Field label="Travelers">
            <input type="number" min={1} max={30} value={travelers} onChange={(e) => setTravelers(Number(e.target.value))} className="input" />
          </Field>
          <Field label="Start date">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" />
          </Field>
          <Field label="End date">
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input" />
          </Field>
          <Field label="Notes" full>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} rows={3} className="input resize-none" />
          </Field>
        </div>

        <button disabled={busy} className="mt-5 w-full rounded-full bg-gradient-brand px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
          {busy ? "Sending…" : "Send booking request"}
        </button>
        <style>{`.input{width:100%;border-radius:9999px;border:1px solid hsl(var(--border));background:white;padding:.6rem 1rem;font-size:.875rem;outline:none}.input:focus{border-color:hsl(var(--primary))}textarea.input{border-radius:1rem}`}</style>
      </form>
    </div>
  );
}

function Field({ label, children, required, full }: { label: string; children: React.ReactNode; required?: boolean; full?: boolean }) {
  return (
    <label className={`block text-xs font-semibold uppercase tracking-wider text-muted-foreground ${full ? "sm:col-span-2" : ""}`}>
      <span>{label}{required && <span className="text-primary"> *</span>}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
