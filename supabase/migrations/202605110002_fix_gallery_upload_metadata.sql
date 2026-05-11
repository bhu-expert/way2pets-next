-- Fix Gallery upload metadata persistence.
-- Apply this after 202605110001_cms_real_world_admin.sql on existing projects.

alter table public.gallery_images add column if not exists subcategory text;

create index if not exists gallery_images_visible_sort_idx
  on public.gallery_images (is_visible, sort_order, created_at desc);

create index if not exists media_assets_public_id_idx
  on public.media_assets (public_id);
