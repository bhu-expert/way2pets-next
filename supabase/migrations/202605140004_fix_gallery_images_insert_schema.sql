-- Safe gallery upload schema compatibility patch.
-- Adds missing columns required by the server-side media_assets -> gallery_images insert flow.
-- Safe to run more than once; does not drop or delete existing data.

alter table public.gallery_images
  add column if not exists media_asset_id uuid references public.media_assets(id) on delete cascade,
  add column if not exists title text,
  add column if not exists caption text,
  add column if not exists alt_text text,
  add column if not exists category text default 'gallery',
  add column if not exists subcategory text,
  add column if not exists pet_type public.pet_type default 'general',
  add column if not exists is_visible boolean default true,
  add column if not exists is_featured boolean default false,
  add column if not exists sort_order int default 0;

notify pgrst, 'reload schema';
