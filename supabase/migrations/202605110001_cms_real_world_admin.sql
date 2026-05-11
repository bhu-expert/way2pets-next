-- Run after supabase/schema.sql and supabase/seed.sql.
-- Adds practical CMS fields needed by the real-world admin UI.

alter table public.blog_posts add column if not exists category text not null default 'general';
alter table public.blog_posts add column if not exists subcategory text;
alter table public.blog_posts add column if not exists content_html text;
alter table public.blog_posts add column if not exists meta_title text;
alter table public.blog_posts add column if not exists meta_description text;
alter table public.blog_posts add column if not exists canonical_url text;
alter table public.blog_posts add column if not exists og_title text;
alter table public.blog_posts add column if not exists og_description text;
alter table public.blog_posts add column if not exists og_image_id uuid references public.media_assets(id);

alter table public.pets add column if not exists subcategory text;
alter table public.pets add column if not exists featured_image_id uuid references public.media_assets(id);
alter table public.pets add column if not exists meta_title text;
alter table public.pets add column if not exists meta_description text;

alter table public.gallery_images add column if not exists subcategory text;

create index if not exists blog_posts_category_subcategory_idx on public.blog_posts (category, subcategory);
create index if not exists pets_status_availability_idx on public.pets (status, availability_status);
create index if not exists gallery_images_category_visible_idx on public.gallery_images (category, is_visible);

insert into public.blog_categories (name, slug, pet_type, description, status)
values
  ('Dogs', 'dogs', 'dog', 'Dog articles and dog service guides', 'published'),
  ('Cats', 'cats', 'cat', 'Cat articles and cat service guides', 'published'),
  ('General', 'general', 'general', 'General pet care and Way2Pets updates', 'published')
on conflict (slug) do update set name = excluded.name, pet_type = excluded.pet_type, description = excluded.description, status = excluded.status;
