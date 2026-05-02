import { RoamioLogo } from "./RoamioLogo";

const cols = [
  {
    title: "Explore",
    links: ["Stays", "Tours", "Flights", "Car rentals", "Food", "Visas"],
  },
  {
    title: "For partners",
    links: ["List your property", "Become a guide", "Fleet partners", "Airline portal"],
  },
  {
    title: "Company",
    links: ["About Roamio", "Careers", "Press", "Contact"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <RoamioLogo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The fluid travel OS — orchestrating every part of the journey,
              starting in Kenya.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">
                {c.title}
              </div>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Roamio. Crafted in Nairobi.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
