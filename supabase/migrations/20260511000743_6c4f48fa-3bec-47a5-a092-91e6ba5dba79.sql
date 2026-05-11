
CREATE TABLE public.membership_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  level int NOT NULL UNIQUE,
  min_bookings int NOT NULL DEFAULT 0,
  stay_discount_pct int NOT NULL DEFAULT 0,
  transport_discount_pct int NOT NULL DEFAULT 0,
  perks jsonb NOT NULL DEFAULT '[]'::jsonb,
  color text NOT NULL DEFAULT '#3B82F6',
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.membership_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tiers public read" ON public.membership_tiers
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Tiers admin write" ON public.membership_tiers
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER membership_tiers_updated_at BEFORE UPDATE ON public.membership_tiers
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.user_memberships (
  user_id uuid PRIMARY KEY,
  tier_slug text NOT NULL DEFAULT 'wanderer-1' REFERENCES public.membership_tiers(slug),
  bookings_count int NOT NULL DEFAULT 0,
  points int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Membership owner read" ON public.user_memberships
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Membership owner update" ON public.user_memberships
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Membership owner insert" ON public.user_memberships
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Membership admin all" ON public.user_memberships
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER user_memberships_updated_at BEFORE UPDATE ON public.user_memberships
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Extend the new-user handler to also create a membership row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, display_name) VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  INSERT INTO public.user_memberships (user_id, tier_slug) VALUES (NEW.id, 'wanderer-1')
    ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END; $function$;

-- Seed tiers
INSERT INTO public.membership_tiers (slug, name, level, min_bookings, stay_discount_pct, transport_discount_pct, perks, color, description) VALUES
  ('wanderer-1', 'Wanderer L1', 1, 0, 5, 5, '["5% off stays","5% off transport","Concierge email support"]'::jsonb, '#60A5FA', 'Your starting tier. Welcome to Roamio Rewards.'),
  ('wanderer-2', 'Wanderer L2', 2, 5, 10, 10, '["10% off stays","10% off transport","Priority chat support","Free room upgrades when available"]'::jsonb, '#3B82F6', 'Unlocked after 5 completed bookings.'),
  ('voyager', 'Voyager', 3, 15, 12, 12, '["12% off stays & transport","Late checkout","Curated trip alerts","Dedicated concierge"]'::jsonb, '#8B5CF6', 'For travelers with 15+ trips on Roamio.'),
  ('pathfinder', 'Pathfinder', 4, 30, 15, 15, '["15% off everything","Complimentary airport transfers","Exclusive experience invites"]'::jsonb, '#EC4899', 'A reward for our most loyal explorers.'),
  ('globetrotter', 'Globetrotter', 5, 50, 20, 18, '["20% off stays, 18% off transport","Annual gift voucher","Members-only safari weekends","24/7 personal concierge"]'::jsonb, '#F59E0B', 'The pinnacle of Roamio Rewards.');
