import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  useItineraries,
  createItinerary,
  addListingToItinerary,
} from "@/hooks/useItinerary";
import type { Listing, ServiceSlug } from "@/data/countries";

type Props = {
  listing: Listing;
  countrySlug: string;
  service: ServiceSlug;
};

export function AddToItineraryButton({ listing, countrySlug, service }: Props) {
  const { user, loading: authLoading } = useAuth();
  const { itineraries, loading, refresh } = useItineraries();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  if (authLoading) {
    return (
      <button disabled className="mt-5 w-full rounded-full bg-primary/70 px-5 py-3 text-sm font-semibold text-primary-foreground">
        <Loader2 className="mx-auto h-4 w-4 animate-spin" />
      </button>
    );
  }

  if (!user) {
    return (
      <Link
        to="/auth"
        className="mt-5 block w-full rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground shadow-soft transition hover:shadow-float"
      >
        Sign in to add to itinerary
      </Link>
    );
  }

  const handleAdd = async (itineraryId: string) => {
    setBusy(true);
    try {
      await addListingToItinerary(itineraryId, countrySlug, service, listing);
      toast.success("Added to itinerary");
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to add");
    } finally {
      setBusy(false);
    }
  };

  const handleCreate = async () => {
    const title = newTitle.trim() || `${listing.title} trip`;
    setBusy(true);
    try {
      const it = await createItinerary(title, countrySlug);
      await addListingToItinerary(it.id, countrySlug, service, listing);
      await refresh();
      toast.success("Itinerary created");
      setOpen(false);
      setNewTitle("");
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:shadow-float"
      >
        <Plus className="h-4 w-4" /> Add to itinerary
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-float">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Save</div>
                <h3 className="text-xl font-medium">Add to itinerary</h3>
              </div>
              <button onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">Close</button>
            </div>

            <div className="mt-5 space-y-2 max-h-64 overflow-y-auto">
              {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
              {!loading && itineraries.length === 0 && (
                <p className="text-sm text-muted-foreground">No itineraries yet — create your first below.</p>
              )}
              {itineraries.map((it) => (
                <button
                  key={it.id}
                  disabled={busy}
                  onClick={() => handleAdd(it.id)}
                  className="flex w-full items-center justify-between rounded-2xl border border-border bg-white px-4 py-3 text-left text-sm transition hover:border-primary"
                >
                  <span className="font-medium">{it.title}</span>
                  <Plus className="h-4 w-4 text-primary" />
                </button>
              ))}
            </div>

            <div className="mt-5 border-t border-border pt-5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">New itinerary</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Trip name"
                maxLength={80}
                className="mt-2 w-full rounded-full border border-border bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
              <button
                disabled={busy}
                onClick={handleCreate}
                className="mt-3 w-full rounded-full bg-gradient-brand px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {busy ? "Saving…" : "Create & add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
