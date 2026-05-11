// Pricing engine — applies membership tier discounts to stays & transport.

export type Discountable = {
  service: string;
  price: string;
};

export type Membership = {
  tier_slug: string;
  stay_discount_pct: number;
  transport_discount_pct: number;
} | null;

// Services that benefit from each discount bucket.
const STAY_SERVICES = new Set(["stays", "stay"]);
const TRANSPORT_SERVICES = new Set(["transport", "cars", "flights", "transfers"]);

/** Parse a price string like "$310", "USD 1,200", "$45 / person" into a number. */
export function parsePrice(raw: string | null | undefined): number {
  if (!raw) return 0;
  const match = String(raw).replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

/** Format a number as currency in the same style listings use ($X). */
export function formatPrice(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "$0";
  return `$${Math.round(n).toLocaleString()}`;
}

/** Which discount % applies to this service, given a membership. */
export function discountPctFor(service: string, m: Membership): number {
  if (!m) return 0;
  const s = service.toLowerCase();
  if (STAY_SERVICES.has(s)) return m.stay_discount_pct || 0;
  if (TRANSPORT_SERVICES.has(s)) return m.transport_discount_pct || 0;
  return 0;
}

export type LineTotal = {
  service: string;
  base: number;
  discountPct: number;
  discount: number;
  total: number;
};

export type ItineraryTotals = {
  lines: LineTotal[];
  subtotal: number;
  totalDiscount: number;
  total: number;
  stayDiscount: number;
  transportDiscount: number;
};

export function computeItineraryTotals(
  items: Discountable[],
  membership: Membership,
): ItineraryTotals {
  let subtotal = 0;
  let totalDiscount = 0;
  let stayDiscount = 0;
  let transportDiscount = 0;
  const lines: LineTotal[] = [];

  for (const it of items) {
    const base = parsePrice(it.price);
    const pct = discountPctFor(it.service, membership);
    const discount = +((base * pct) / 100).toFixed(2);
    const total = +(base - discount).toFixed(2);
    lines.push({ service: it.service, base, discountPct: pct, discount, total });
    subtotal += base;
    totalDiscount += discount;
    if (STAY_SERVICES.has(it.service.toLowerCase())) stayDiscount += discount;
    if (TRANSPORT_SERVICES.has(it.service.toLowerCase())) transportDiscount += discount;
  }

  return {
    lines,
    subtotal: +subtotal.toFixed(2),
    totalDiscount: +totalDiscount.toFixed(2),
    total: +(subtotal - totalDiscount).toFixed(2),
    stayDiscount: +stayDiscount.toFixed(2),
    transportDiscount: +transportDiscount.toFixed(2),
  };
}
