ALTER TABLE public.booking_requests
  ADD COLUMN IF NOT EXISTS admin_reference text,
  ADD COLUMN IF NOT EXISTS admin_summary text;