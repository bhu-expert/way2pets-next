-- Way2Pets Supabase schema
-- Run this in the Supabase SQL editor after creating the project.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  create type public.content_status as enum ('draft', 'published', 'scheduled', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.pet_type as enum ('dog', 'cat', 'both', 'general');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.lead_status as enum ('new', 'contacted', 'qualified', 'converted', 'lost', 'spam');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.booking_status as enum ('new', 'contacted', 'confirmed', 'checked-in', 'checked-out', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('pending', 'advance-paid', 'full-paid', 'refunded', 'adjusted');
exception when duplicate_object then null; end $$;

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  route_path text not null unique,
  page_type text not null default 'landing',
  status public.content_status not null default 'draft',
  hero_title text,
  hero_subtitle text,
  hero_image_id uuid,
  content_json jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  section_type text not null,
  sort_order int not null default 0,
  heading text,
  body text,
  settings_json jsonb not null default '{}'::jsonb,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'cloudinary',
  category text not null default 'gallery',
  public_id text not null,
  secure_url text not null,
  width int,
  height int,
  format text,
  resource_type text not null default 'image',
  bytes int,
  alt_text text,
  title text,
  caption text,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seo_metadata (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  route_path text,
  meta_title text,
  meta_description text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image_id uuid references public.media_assets(id),
  schema_type text,
  schema_json jsonb not null default '{}'::jsonb,
  robots_index boolean not null default true,
  robots_follow boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references public.blog_categories(id),
  pet_type public.pet_type not null default 'general',
  description text,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  full_path text not null unique,
  pet_type public.pet_type not null default 'general',
  category_id uuid references public.blog_categories(id),
  excerpt text,
  content_markdown text,
  featured_image_id uuid references public.media_assets(id),
  faq_json jsonb not null default '[]'::jsonb,
  table_of_contents_json jsonb not null default '[]'::jsonb,
  related_post_ids uuid[] not null default '{}',
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  pet_type public.pet_type not null,
  listing_type text not null default 'sale',
  name text not null,
  slug text not null unique,
  breed text,
  age text,
  gender text,
  price numeric(12,2),
  location text default 'Lucknow',
  vaccination_status text,
  temperament text,
  health_notes text,
  description text,
  image_ids uuid[] not null default '{}',
  availability_status text not null default 'available',
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pet_registrations (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null,
  mobile text not null,
  whatsapp text,
  email text,
  city text,
  pet_type text not null,
  breed text,
  pet_name text not null,
  age text,
  gender text,
  vaccination_status text,
  purpose text,
  notes text,
  image_id uuid references public.media_assets(id),
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.boarding_bookings (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null,
  mobile text not null,
  whatsapp text,
  email text,
  city text,
  pet_type text not null,
  breed text,
  pet_name text not null,
  check_in_date date not null,
  check_out_date date not null,
  number_of_days int,
  food_preference text,
  packaged_food_by_owner boolean not null default false,
  fresh_cooked_food_by_way2pets boolean not null default false,
  medical_condition text,
  vaccination_status text,
  aggression_status text,
  special_instructions text,
  booking_status public.booking_status not null default 'new',
  payment_status public.payment_status not null default 'pending',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  mobile text not null,
  email text,
  topic text,
  message text,
  source_page text,
  lead_status public.lead_status not null default 'new',
  follow_up_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  media_asset_id uuid not null references public.media_assets(id) on delete cascade,
  title text,
  alt_text text,
  caption text,
  pet_type public.pet_type default 'general',
  category text not null default 'gallery',
  is_visible boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_name text not null,
  rating int not null check (rating between 1 and 5),
  review_text text not null,
  source text not null default 'manual',
  source_url text,
  review_image_id uuid references public.media_assets(id),
  is_featured boolean not null default false,
  status public.content_status not null default 'published',
  reviewed_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.redirects (
  id uuid primary key default gen_random_uuid(),
  source_path text not null unique,
  destination_path text not null,
  status_code int not null default 301,
  is_active boolean not null default true,
  hit_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value_json jsonb not null default '{}'::jsonb,
  group_name text not null default 'general',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_records (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.boarding_bookings(id) on delete cascade,
  payment_mode text not null,
  amount_paid numeric(12,2) not null,
  payment_date date not null default current_date,
  transaction_reference text,
  payment_note text,
  receipt_number text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at triggers
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['pages','page_sections','media_assets','seo_metadata','blog_categories','blog_posts','pets','pet_registrations','boarding_bookings','contact_leads','gallery_images','reviews','redirects','site_settings','payment_records']
  LOOP
    EXECUTE format('drop trigger if exists set_%I_updated_at on public.%I', t, t);
    EXECUTE format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  END LOOP;
END $$;

alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.media_assets enable row level security;
alter table public.seo_metadata enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.pets enable row level security;
alter table public.pet_registrations enable row level security;
alter table public.boarding_bookings enable row level security;
alter table public.contact_leads enable row level security;
alter table public.gallery_images enable row level security;
alter table public.reviews enable row level security;
alter table public.redirects enable row level security;
alter table public.site_settings enable row level security;
alter table public.payment_records enable row level security;

-- Public read policies for published/visible content.
create policy "public read published pages" on public.pages for select using (status = 'published');
create policy "public read enabled sections" on public.page_sections for select using (is_enabled = true and exists (select 1 from public.pages p where p.id = page_id and p.status = 'published'));
create policy "public read media" on public.media_assets for select using (true);
create policy "public read seo metadata" on public.seo_metadata for select using (robots_index = true);
create policy "public read published categories" on public.blog_categories for select using (status = 'published');
create policy "public read published posts" on public.blog_posts for select using (status = 'published' and published_at <= now());
create policy "public read listed pets" on public.pets for select using (status = 'published');
create policy "public read visible gallery" on public.gallery_images for select using (is_visible = true);
create policy "public read published reviews" on public.reviews for select using (status = 'published');
create policy "public read active redirects" on public.redirects for select using (is_active = true);

-- Public form inserts. Admin/server service role bypasses RLS automatically.
create policy "public insert pet registrations" on public.pet_registrations for insert with check (true);
create policy "public insert boarding bookings" on public.boarding_bookings for insert with check (true);
create policy "public insert contact leads" on public.contact_leads for insert with check (true);

-- Authenticated admins can manage content. Single-admin enforcement is handled by app ADMIN_EMAIL guard.
create policy "authenticated manage pages" on public.pages for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage sections" on public.page_sections for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage media" on public.media_assets for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage seo" on public.seo_metadata for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage categories" on public.blog_categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage posts" on public.blog_posts for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage pets" on public.pets for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage registrations" on public.pet_registrations for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage bookings" on public.boarding_bookings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage leads" on public.contact_leads for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage gallery" on public.gallery_images for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage reviews" on public.reviews for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage redirects" on public.redirects for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage settings" on public.site_settings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "authenticated manage payments" on public.payment_records for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into public.redirects (source_path, destination_path, status_code, is_active)
values
  ('/boarding', '/pet-boarding-for-cat-and-dog-in-lucknow', 301, true),
  ('/pet-dog-cat-boarding-lucknow', '/pet-boarding-for-cat-and-dog-in-lucknow', 301, true)
on conflict (source_path) do update set destination_path = excluded.destination_path, status_code = excluded.status_code, is_active = excluded.is_active;
