
-- Helper functions (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'super_admin')
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_super(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','super_admin')
  )
$$;

-- Agent <-> country assignments
CREATE TABLE public.agent_country_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  country_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, country_slug)
);
ALTER TABLE public.agent_country_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agent assignments admin all"
  ON public.agent_country_assignments FOR ALL TO authenticated
  USING (public.is_admin_or_super(auth.uid()))
  WITH CHECK (public.is_admin_or_super(auth.uid()));

CREATE POLICY "Agent assignments self read"
  ON public.agent_country_assignments FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Operator <-> listing assignments
CREATE TABLE public.operator_listing_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  listing_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, listing_id)
);
ALTER TABLE public.operator_listing_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Operator assignments admin all"
  ON public.operator_listing_assignments FOR ALL TO authenticated
  USING (public.is_admin_or_super(auth.uid()))
  WITH CHECK (public.is_admin_or_super(auth.uid()));

CREATE POLICY "Operator assignments self read"
  ON public.operator_listing_assignments FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Scope-check helpers
CREATE OR REPLACE FUNCTION public.is_country_agent_for(_user_id uuid, _country_slug text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.agent_country_assignments
    WHERE user_id = _user_id AND country_slug = _country_slug
  )
$$;

CREATE OR REPLACE FUNCTION public.is_operator_for_listing(_user_id uuid, _listing_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.operator_listing_assignments
    WHERE user_id = _user_id AND listing_id = _listing_id
  )
$$;

CREATE OR REPLACE FUNCTION public.agent_can_access_itinerary(_user_id uuid, _itinerary_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.itinerary_items ii
    JOIN public.agent_country_assignments aca
      ON aca.user_id = _user_id AND aca.country_slug = ii.country_slug
    WHERE ii.itinerary_id = _itinerary_id
  ) OR EXISTS (
    SELECT 1
    FROM public.itineraries i
    JOIN public.agent_country_assignments aca
      ON aca.user_id = _user_id AND aca.country_slug = i.country_slug
    WHERE i.id = _itinerary_id
  )
$$;

CREATE OR REPLACE FUNCTION public.operator_can_access_itinerary(_user_id uuid, _itinerary_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.itinerary_items ii
    JOIN public.operator_listing_assignments ola
      ON ola.user_id = _user_id AND ola.listing_id = ii.listing_id
    WHERE ii.itinerary_id = _itinerary_id
  )
$$;

-- Extend booking_requests policies
CREATE POLICY "Bookings super admin all"
  ON public.booking_requests FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Bookings agent read"
  ON public.booking_requests FOR SELECT TO authenticated
  USING (public.agent_can_access_itinerary(auth.uid(), itinerary_id));

CREATE POLICY "Bookings agent update"
  ON public.booking_requests FOR UPDATE TO authenticated
  USING (public.agent_can_access_itinerary(auth.uid(), itinerary_id))
  WITH CHECK (public.agent_can_access_itinerary(auth.uid(), itinerary_id));

CREATE POLICY "Bookings operator read"
  ON public.booking_requests FOR SELECT TO authenticated
  USING (public.operator_can_access_itinerary(auth.uid(), itinerary_id));

-- Extend listings policies
CREATE POLICY "Listings super admin write"
  ON public.listings FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Listings agent write"
  ON public.listings FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.countries c
    WHERE c.id = listings.country_id
      AND public.is_country_agent_for(auth.uid(), c.slug)
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.countries c
    WHERE c.id = listings.country_id
      AND public.is_country_agent_for(auth.uid(), c.slug)
  ));

-- Extend countries policies
CREATE POLICY "Countries super admin write"
  ON public.countries FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- Extend memberships and tiers
CREATE POLICY "Membership super admin all"
  ON public.user_memberships FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Tiers super admin write"
  ON public.membership_tiers FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- Roles management: super admin can also manage roles
CREATE POLICY "Super admins manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));
