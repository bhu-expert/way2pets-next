-- Pet media support for multiple pet images/videos.
-- Safe/idempotent: uses IF NOT EXISTS and guarded trigger/policy creation.

create extension if not exists pgcrypto;

alter table public.media_assets add column if not exists media_type text null;
alter table public.media_assets add column if not exists duration numeric null;
alter table public.media_assets add column if not exists thumbnail_url text null;

update public.media_assets
set media_type = coalesce(media_type, resource_type, 'image')
where media_type is null;

create table if not exists public.pet_media (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  media_asset_id uuid not null references public.media_assets(id) on delete cascade,
  media_type text not null default 'image',
  title text null,
  alt_text text null,
  caption text null,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pet_media_media_type_check check (media_type in ('image', 'video'))
);

create index if not exists pet_media_pet_id_idx on public.pet_media (pet_id);
create index if not exists pet_media_featured_idx on public.pet_media (pet_id, is_featured) where is_featured = true;
create index if not exists pet_media_sort_idx on public.pet_media (pet_id, sort_order, created_at);
create unique index if not exists pet_media_pet_asset_uidx on public.pet_media (pet_id, media_asset_id);

create or replace function public.set_pet_media_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  create trigger pet_media_set_updated_at
  before update on public.pet_media
  for each row execute function public.set_pet_media_updated_at();
exception when duplicate_object then null; end $$;

-- Backfill links from legacy pets.featured_image_id and pets.image_ids without deleting or changing pet records.
insert into public.pet_media (pet_id, media_asset_id, media_type, title, alt_text, caption, is_featured, sort_order)
select p.id,
       ma.id,
       case when coalesce(ma.resource_type, ma.media_type) = 'video' then 'video' else 'image' end,
       ma.title,
       ma.alt_text,
       ma.caption,
       ma.id = p.featured_image_id,
       coalesce(array_position(p.image_ids, ma.id), 1) - 1
from public.pets p
join public.media_assets ma on ma.id = any(p.image_ids) or ma.id = p.featured_image_id
where (p.image_ids is not null and array_length(p.image_ids, 1) > 0) or p.featured_image_id is not null
on conflict (pet_id, media_asset_id) do update set
  media_type = excluded.media_type,
  title = coalesce(public.pet_media.title, excluded.title),
  alt_text = coalesce(public.pet_media.alt_text, excluded.alt_text),
  caption = coalesce(public.pet_media.caption, excluded.caption),
  is_featured = public.pet_media.is_featured or excluded.is_featured,
  sort_order = least(public.pet_media.sort_order, excluded.sort_order);

-- Ensure each pet with image media has a featured image, preferring the first image by sort order.
with ranked as (
  select pm.id,
         row_number() over (partition by pm.pet_id order by pm.sort_order asc, pm.created_at asc) as rn
  from public.pet_media pm
  where pm.media_type = 'image'
    and not exists (select 1 from public.pet_media featured where featured.pet_id = pm.pet_id and featured.is_featured = true and featured.media_type = 'image')
)
update public.pet_media pm
set is_featured = true
from ranked
where pm.id = ranked.id and ranked.rn = 1;

alter table public.pet_media enable row level security;

do $$ begin
  create policy "Public can select pet media for published pets" on public.pet_media
    for select using (exists (select 1 from public.pets p where p.id = pet_id and p.status = 'published'));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can select own pet media" on public.pet_media
    for select using (exists (select 1 from public.pets p where p.id = pet_id and auth.uid() = p.user_id));
exception when duplicate_object then null; end $$;

notify pgrst, 'reload schema';
