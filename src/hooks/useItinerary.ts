import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Listing, ServiceSlug } from "@/data/countries";

export type Itinerary = {
  id: string;
  user_id: string;
  title: string;
  summary: string | null;
  country_slug: string | null;
  share_token: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type ItineraryItem = {
  id: string;
  itinerary_id: string;
  position: number;
  listing_id: string | null;
  country_slug: string;
  service: string;
  listing_slug: string;
  title: string;
  image: string;
  location: string;
  price: string;
  notes: string | null;
};

export function useItineraries() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("itineraries")
      .select("*")
      .order("updated_at", { ascending: false });
    setItineraries((data as Itinerary[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { itineraries, loading, refresh };
}

export async function createItinerary(title: string, countrySlug?: string) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sign in to save itineraries");
  const { data, error } = await supabase
    .from("itineraries")
    .insert({ title, country_slug: countrySlug ?? null, user_id: u.user.id })
    .select()
    .single();
  if (error) throw error;
  return data as Itinerary;
}

export async function addListingToItinerary(
  itineraryId: string,
  countrySlug: string,
  service: ServiceSlug,
  listing: Listing,
) {
  const { count } = await supabase
    .from("itinerary_items")
    .select("id", { count: "exact", head: true })
    .eq("itinerary_id", itineraryId);
  const { error } = await supabase.from("itinerary_items").insert({
    itinerary_id: itineraryId,
    position: count ?? 0,
    country_slug: countrySlug,
    service,
    listing_slug: listing.id,
    title: listing.title,
    image: listing.image,
    location: listing.location,
    price: listing.price,
  });
  if (error) throw error;
}
