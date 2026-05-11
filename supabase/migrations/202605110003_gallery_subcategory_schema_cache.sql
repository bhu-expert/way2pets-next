-- Add optional Gallery subcategory support and reload PostgREST schema cache.
-- Safe to run more than once.

alter table public.gallery_images
  add column if not exists subcategory text;

notify pgrst, 'reload schema';
