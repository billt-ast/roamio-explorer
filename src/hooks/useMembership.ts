import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type MembershipInfo = {
  tier_slug: string;
  tier_name: string;
  level: number;
  stay_discount_pct: number;
  transport_discount_pct: number;
  bookings_count: number;
};

export function useMembership() {
  const { user } = useAuth();
  const [data, setData] = useState<MembershipInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) {
        setData(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data: m } = await supabase
        .from("user_memberships")
        .select("tier_slug, bookings_count")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!m) {
        if (!cancelled) {
          setData(null);
          setLoading(false);
        }
        return;
      }
      const { data: tier } = await supabase
        .from("membership_tiers")
        .select("slug, name, level, stay_discount_pct, transport_discount_pct")
        .eq("slug", m.tier_slug)
        .maybeSingle();
      if (cancelled) return;
      if (tier) {
        setData({
          tier_slug: tier.slug,
          tier_name: tier.name,
          level: tier.level,
          stay_discount_pct: tier.stay_discount_pct,
          transport_discount_pct: tier.transport_discount_pct,
          bookings_count: m.bookings_count,
        });
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { membership: data, loading };
}
