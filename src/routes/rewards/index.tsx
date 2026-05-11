import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Award, Check, Lock, Sparkles, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/rewards/")({
  component: RewardsPage,
  head: () => ({
    meta: [
      { title: "Roamio Rewards — Earn perks every trip" },
      {
        name: "description",
        content:
          "Roamio Rewards is our membership program. Unlock stay & transport discounts, upgrades and concierge perks as you travel.",
      },
    ],
  }),
});

type Tier = {
  id: string;
  slug: string;
  name: string;
  level: number;
  min_bookings: number;
  stay_discount_pct: number;
  transport_discount_pct: number;
  perks: string[];
  color: string;
  description: string;
};

type Membership = {
  user_id: string;
  tier_slug: string;
  bookings_count: number;
  points: number;
};

function RewardsPage() {
  const { user, loading: authLoading } = useAuth();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: t } = await supabase
        .from("membership_tiers")
        .select("*")
        .order("level", { ascending: true });
      setTiers((t as unknown as Tier[]) ?? []);

      if (user) {
        const { data: m } = await supabase
          .from("user_memberships")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        setMembership((m as Membership | null) ?? null);
      }
      setLoading(false);
    })();
  }, [user]);

  const currentTier = membership ? tiers.find((t) => t.slug === membership.tier_slug) : null;
  const currentLevel = currentTier?.level ?? 0;
  const nextTier = tiers.find((t) => t.level === currentLevel + 1);
  const progress =
    nextTier && membership
      ? Math.min(100, Math.round((membership.bookings_count / nextTier.min_bookings) * 100))
      : 100;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pt-32 pb-16 sm:px-6">
        <header className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Roamio Rewards
          </div>
          <h1 className="mt-4 text-4xl font-medium tracking-tight sm:text-5xl">
            Travel more. Spend less. Get treated like a regular.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Every booking moves you up a tier. Higher tiers mean bigger discounts, free upgrades
            and a dedicated concierge — across stays, transport and experiences.
          </p>
        </header>

        {/* Signed-in: progress */}
        {user && !authLoading && (
          <section className="mt-10 overflow-hidden rounded-3xl bg-gradient-brand p-8 text-white shadow-soft">
            {loading ? (
              <div className="h-32 animate-pulse rounded-2xl bg-white/10" />
            ) : currentTier ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/80">
                      Your tier
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-3xl font-semibold">
                      <Award className="h-7 w-7" /> {currentTier.name}
                    </div>
                    <p className="mt-2 max-w-md text-sm text-white/85">
                      {currentTier.description}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-5 py-3 text-right">
                    <div className="text-xs uppercase tracking-wider text-white/80">
                      Lifetime bookings
                    </div>
                    <div className="text-3xl font-semibold">
                      {membership?.bookings_count ?? 0}
                    </div>
                  </div>
                </div>

                {nextTier ? (
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-white/85">
                        {Math.max(0, nextTier.min_bookings - (membership?.bookings_count ?? 0))} bookings to{" "}
                        <span className="font-semibold">{nextTier.name}</span>
                      </span>
                      <span className="text-white/85">{progress}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/15">
                      <div
                        className="h-full rounded-full bg-white transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 flex items-center gap-2 text-sm text-white/90">
                    <TrendingUp className="h-4 w-4" /> You've reached the top tier. Legend.
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-white/85">
                Your rewards profile is being set up — check back in a moment.
              </div>
            )}
          </section>
        )}

        {/* Non signed-in: CTA */}
        {!user && !authLoading && (
          <section className="mt-10 rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-10">
            <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
              <div>
                <h2 className="text-2xl font-medium sm:text-3xl">Join free in 30 seconds.</h2>
                <p className="mt-2 max-w-xl text-muted-foreground">
                  Create an account to start earning rewards from your first booking. No fees, no
                  catches — just better travel.
                </p>
              </div>
              <Link
                to="/auth"
                className="inline-flex items-center justify-center rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95"
              >
                Sign up to start earning
              </Link>
            </div>
          </section>
        )}

        {/* Tiers grid */}
        <section className="mt-14">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                The ladder
              </div>
              <h2 className="mt-1 text-3xl font-medium sm:text-4xl">Five tiers. One journey.</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier) => {
              const isCurrent = currentTier?.slug === tier.slug;
              const isLocked = currentLevel > 0 && tier.level > currentLevel;
              const isAchieved = currentLevel >= tier.level;

              return (
                <article
                  key={tier.id}
                  className={`relative overflow-hidden rounded-2xl border bg-card p-6 shadow-soft transition ${
                    isCurrent ? "ring-2 ring-primary" : "border-border"
                  }`}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: tier.color }}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                        style={{ background: tier.color }}
                      >
                        Level {tier.level}
                      </div>
                      <div className="mt-2 text-xl font-semibold">{tier.name}</div>
                    </div>
                    {user &&
                      (isCurrent ? (
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                          Current
                        </span>
                      ) : isAchieved ? (
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                          Unlocked
                        </span>
                      ) : isLocked ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : null)}
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">{tier.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-muted px-2.5 py-1 font-medium">
                      {tier.stay_discount_pct}% off stays
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1 font-medium">
                      {tier.transport_discount_pct}% off transport
                    </span>
                  </div>

                  <ul className="mt-4 space-y-1.5">
                    {(Array.isArray(tier.perks) ? tier.perks : []).map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
                    Unlocks at <span className="font-semibold text-foreground">{tier.min_bookings}</span>{" "}
                    completed bookings
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {!user && (
          <section className="mt-14 rounded-3xl bg-gradient-brand p-8 text-center text-white shadow-soft sm:p-10">
            <h3 className="text-2xl font-medium sm:text-3xl">Ready to climb?</h3>
            <p className="mx-auto mt-2 max-w-xl text-white/85">
              Sign up free and we'll start counting from your very first booking.
            </p>
            <Link
              to="/auth"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-foreground"
            >
              Create your account
            </Link>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
