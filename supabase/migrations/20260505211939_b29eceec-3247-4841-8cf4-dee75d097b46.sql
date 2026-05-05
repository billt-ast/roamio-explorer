
CREATE TABLE public.itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'My Roamio Trip',
  summary TEXT DEFAULT '',
  country_slug TEXT,
  share_token UUID NOT NULL DEFAULT gen_random_uuid(),
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.itinerary_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  -- Snapshot fields so items survive even if a listing is removed
  listing_id UUID,
  country_slug TEXT NOT NULL,
  service TEXT NOT NULL,
  listing_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  notes TEXT DEFAULT '',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_itinerary_items_itinerary ON public.itinerary_items(itinerary_id, position);

CREATE TABLE public.booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  travelers INTEGER NOT NULL DEFAULT 1,
  start_date DATE,
  end_date DATE,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- itineraries policies
CREATE POLICY "Itineraries owner read" ON public.itineraries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Itineraries public read" ON public.itineraries FOR SELECT TO anon, authenticated USING (is_public = true);
CREATE POLICY "Itineraries owner insert" ON public.itineraries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Itineraries owner update" ON public.itineraries FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Itineraries owner delete" ON public.itineraries FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- itinerary_items policies (use itinerary ownership)
CREATE POLICY "Items owner read" ON public.itinerary_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.itineraries i WHERE i.id = itinerary_id AND i.user_id = auth.uid()));
CREATE POLICY "Items public read" ON public.itinerary_items FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.itineraries i WHERE i.id = itinerary_id AND i.is_public = true));
CREATE POLICY "Items owner insert" ON public.itinerary_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.itineraries i WHERE i.id = itinerary_id AND i.user_id = auth.uid()));
CREATE POLICY "Items owner update" ON public.itinerary_items FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.itineraries i WHERE i.id = itinerary_id AND i.user_id = auth.uid()));
CREATE POLICY "Items owner delete" ON public.itinerary_items FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.itineraries i WHERE i.id = itinerary_id AND i.user_id = auth.uid()));

-- booking_requests policies
CREATE POLICY "Bookings owner read" ON public.booking_requests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Bookings admin read" ON public.booking_requests FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Bookings owner insert" ON public.booking_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Bookings admin update" ON public.booking_requests FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- updated_at triggers
CREATE TRIGGER touch_itineraries BEFORE UPDATE ON public.itineraries FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_booking_requests BEFORE UPDATE ON public.booking_requests FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
