import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Roamio" },
      { name: "description", content: "Internal Roamio admin console for managing countries and listings." },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: "https://roamio-explorer.lovable.app/admin" }],
  }),
  component: AdminPage,
});

type Country = { id: string; slug: string; name: string; tagline: string; hero_image: string; status: string };
type Listing = {
  id: string; country_id: string; service: string; slug: string; title: string;
  location: string; price: string; price_unit: string | null; rating: number;
  badge: string | null; image: string; description: string;
};

const SERVICES = ["stays", "experiences", "flights", "attractions", "food", "transport"] as const;

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [tab, setTab] = useState<"countries" | "listings">("countries");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const refresh = async () => {
    const [c, l] = await Promise.all([
      supabase.from("countries").select("*").order("name"),
      supabase.from("listings").select("*").order("created_at", { ascending: false }),
    ]);
    if (c.data) setCountries(c.data as Country[]);
    if (l.data) setListings(l.data as Listing[]);
  };

  useEffect(() => { if (isAdmin) refresh(); }, [isAdmin]);

  if (loading) return <div className="p-12 text-center">Loading…</div>;
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen"><Navbar />
        <main className="mx-auto max-w-md py-24 text-center">
          <h1 className="text-3xl font-medium">Admin access required</h1>
          <p className="mt-3 text-muted-foreground">Your account ({user.email}) doesn't have the admin role yet.</p>
          <p className="mt-2 text-xs text-muted-foreground">Ask a Roamio admin to grant access in the user_roles table.</p>
          <Link to="/" className="mt-6 inline-block text-primary underline">← Back home</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-medium">Admin</h1>
            <p className="text-sm text-muted-foreground">Manage countries and listings.</p>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/" }))} className="rounded-full border border-border px-4 py-2 text-xs">Sign out</button>
        </div>

        <div className="mt-8 flex gap-2 border-b border-border">
          {(["countries", "listings"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-semibold capitalize ${tab === t ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}>{t}</button>
          ))}
        </div>

        {tab === "countries" ? (
          <CountriesTab countries={countries} onChange={refresh} />
        ) : (
          <ListingsTab listings={listings} countries={countries} onChange={refresh} />
        )}
      </main>
    </div>
  );
}

function CountriesTab({ countries, onChange }: { countries: Country[]; onChange: () => void }) {
  const [form, setForm] = useState({ slug: "", name: "", tagline: "", hero_image: "", status: "Soon" });
  const create = async () => {
    const { error } = await supabase.from("countries").insert(form);
    if (error) return toast.error(error.message);
    toast.success("Created"); setForm({ slug: "", name: "", tagline: "", hero_image: "", status: "Soon" }); onChange();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("countries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    onChange();
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-3xl bg-card p-6 shadow-soft">
        <h2 className="font-semibold">New country</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(["slug", "name", "tagline", "hero_image", "status"] as const).map((k) => (
            <input key={k} placeholder={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="rounded-xl border border-border bg-white px-3 py-2 text-sm" />
          ))}
        </div>
        <button onClick={create} className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Create</button>
      </div>

      <div className="overflow-hidden rounded-3xl bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider"><tr><th className="p-3">Name</th><th className="p-3">Slug</th><th className="p-3">Status</th><th className="p-3"></th></tr></thead>
          <tbody>
            {countries.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-3 font-medium">{c.name}</td><td className="p-3 text-muted-foreground">{c.slug}</td><td className="p-3">{c.status}</td>
                <td className="p-3 text-right"><button onClick={() => remove(c.id)} className="text-xs text-destructive">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ListingsTab({ listings, countries, onChange }: { listings: Listing[]; countries: Country[]; onChange: () => void }) {
  const empty = { country_id: "", service: "stays", slug: "", title: "", location: "", price: "", price_unit: "/night", rating: 4.8, badge: "", image: "", description: "" };
  const [form, setForm] = useState(empty);

  const create = async () => {
    if (!form.country_id) return toast.error("Pick a country");
    const { error } = await supabase.from("listings").insert(form);
    if (error) return toast.error(error.message);
    toast.success("Created"); setForm(empty); onChange();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    onChange();
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-3xl bg-card p-6 shadow-soft">
        <h2 className="font-semibold">New listing</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <select value={form.country_id} onChange={(e) => setForm({ ...form, country_id: e.target.value })} className="rounded-xl border border-border bg-white px-3 py-2 text-sm">
            <option value="">Country…</option>
            {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="rounded-xl border border-border bg-white px-3 py-2 text-sm">
            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {(["slug", "title", "location", "price", "price_unit", "badge", "image"] as const).map((k) => (
            <input key={k} placeholder={k} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="rounded-xl border border-border bg-white px-3 py-2 text-sm" />
          ))}
          <input type="number" step="0.01" placeholder="rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="rounded-xl border border-border bg-white px-3 py-2 text-sm" />
          <textarea placeholder="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="sm:col-span-2 rounded-xl border border-border bg-white px-3 py-2 text-sm" rows={3} />
        </div>
        <button onClick={create} className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Create</button>
      </div>

      <div className="overflow-hidden rounded-3xl bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider"><tr><th className="p-3">Title</th><th className="p-3">Country</th><th className="p-3">Service</th><th className="p-3">Price</th><th className="p-3"></th></tr></thead>
          <tbody>
            {listings.map((l) => {
              const c = countries.find((x) => x.id === l.country_id);
              return (
                <tr key={l.id} className="border-t border-border">
                  <td className="p-3 font-medium">{l.title}</td>
                  <td className="p-3 text-muted-foreground">{c?.name ?? "—"}</td>
                  <td className="p-3">{l.service}</td>
                  <td className="p-3">{l.price}{l.price_unit}</td>
                  <td className="p-3 text-right"><button onClick={() => remove(l.id)} className="text-xs text-destructive">Delete</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
