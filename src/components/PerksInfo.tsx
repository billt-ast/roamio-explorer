import { Percent, Car, Lock, Compass, CalendarCheck, Headphones } from "lucide-react";

export function PerksInfo() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Roamio Rewards
          </div>
          <h2 className="mt-1 text-3xl font-medium sm:text-4xl">Travel more, spend less.</h2>
        </div>
        <a href="/rewards" className="text-sm font-semibold text-primary hover:underline">
          Learn more about your rewards →
        </a>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl bg-gradient-brand p-6 text-white shadow-soft">
          <div className="text-2xl font-semibold tracking-tight">Roamio+</div>
          <p className="mt-3 text-sm text-white/85">
            You're at <span className="font-semibold">Wanderer Level 1</span> in our loyalty program.
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div className="font-semibold">10% off stays</div>
            <Percent className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Enjoy discounts at participating stays worldwide.
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <div className="font-semibold">10% off transport</div>
            <Car className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Save on select transfers, rentals and rides.
          </p>
        </article>

        <article className="rounded-2xl border border-dashed border-border bg-muted/30 p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="font-semibold text-muted-foreground">10–15% off stays</div>
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Complete 5 bookings to unlock Wanderer Level 2.
          </p>
        </article>
      </div>

      <div className="mt-14">
        <h3 className="text-2xl font-medium sm:text-3xl">We've got you covered.</h3>
        <div className="mt-6 grid gap-8 sm:grid-cols-3">
          <div className="flex gap-4">
            <Compass className="h-7 w-7 shrink-0 text-primary" />
            <div>
              <div className="font-semibold">Explore top experiences</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Live the best of every destination — safaris, tours, food trails and more.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <CalendarCheck className="h-7 w-7 shrink-0 text-primary" />
            <div>
              <div className="font-semibold">Fast and flexible</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Book in minutes with free cancellation on many stays and experiences.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Headphones className="h-7 w-7 shrink-0 text-primary" />
            <div>
              <div className="font-semibold">Support when you need it</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Roamio's concierge team is here to help, around the clock.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
