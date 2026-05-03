ALTER TABLE public.waitlist
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS age_range text,
  ADD COLUMN IF NOT EXISTS top_categories text,
  ADD COLUMN IF NOT EXISTS payment_apps text;