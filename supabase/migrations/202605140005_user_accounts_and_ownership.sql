create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  mobile text,
  whatsapp text,
  email text,
  city text,
  address text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.boarding_bookings add column if not exists user_id uuid null references auth.users(id) on delete set null;
alter table public.boarding_bookings add column if not exists owner_email text null;
alter table public.boarding_bookings add column if not exists owner_mobile text null;
alter table public.boarding_bookings add column if not exists editable_by_user boolean default true;

alter table public.pet_registrations add column if not exists user_id uuid null references auth.users(id) on delete set null;
alter table public.pet_registrations add column if not exists owner_email text null;
alter table public.pet_registrations add column if not exists owner_mobile text null;
alter table public.pet_registrations add column if not exists editable_by_user boolean default true;

alter table public.pets add column if not exists user_id uuid null references auth.users(id) on delete set null;
alter table public.pets add column if not exists owner_email text null;
alter table public.pets add column if not exists editable_by_user boolean default true;

alter table public.contact_leads add column if not exists user_id uuid null references auth.users(id) on delete set null;
alter table public.contact_leads add column if not exists email text null;
alter table public.contact_leads add column if not exists mobile text null;

update public.boarding_bookings set owner_email = coalesce(owner_email, email), owner_mobile = coalesce(owner_mobile, mobile) where owner_email is null or owner_mobile is null;
update public.pet_registrations set owner_email = coalesce(owner_email, email), owner_mobile = coalesce(owner_mobile, mobile) where owner_email is null or owner_mobile is null;
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'pets' and column_name = 'contact_email') then
    execute 'update public.pets set owner_email = coalesce(owner_email, contact_email) where owner_email is null';
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'set_user_profiles_updated_at') then
    create trigger set_user_profiles_updated_at
      before update on public.user_profiles
      for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.user_profiles enable row level security;
alter table public.boarding_bookings enable row level security;
alter table public.pet_registrations enable row level security;
alter table public.pets enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'user_profiles' and policyname = 'Users can select own profile') then
    create policy "Users can select own profile" on public.user_profiles for select using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'user_profiles' and policyname = 'Users can insert own profile') then
    create policy "Users can insert own profile" on public.user_profiles for insert with check (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'user_profiles' and policyname = 'Users can update own profile') then
    create policy "Users can update own profile" on public.user_profiles for update using (auth.uid() = id) with check (auth.uid() = id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'boarding_bookings' and policyname = 'Users can select own boarding bookings') then
    create policy "Users can select own boarding bookings" on public.boarding_bookings for select using (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'pet_registrations' and policyname = 'Users can select own pet registrations') then
    create policy "Users can select own pet registrations" on public.pet_registrations for select using (auth.uid() = user_id);
  end if;


  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'pets' and policyname = 'Public can select published pets') then
    create policy "Public can select published pets" on public.pets for select using (status = 'published');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'pets' and policyname = 'Users can select own editable pets') then
    create policy "Users can select own editable pets" on public.pets for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'pets' and policyname = 'Users can update own editable pets') then
    create policy "Users can update own editable pets" on public.pets for update using (auth.uid() = user_id and editable_by_user = true) with check (auth.uid() = user_id and editable_by_user = true);
  end if;
end $$;

notify pgrst, 'reload schema';
