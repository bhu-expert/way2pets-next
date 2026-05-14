-- Final SEO QA settings and redirect backfill.
-- Safe to run more than once: all DDL uses IF NOT EXISTS and all seed data uses upserts.

alter table public.contact_leads
  add column if not exists source_page text;

alter table public.boarding_bookings
  add column if not exists source_page text;

alter table public.pet_registrations
  add column if not exists source_page text;

insert into public.site_settings (key, value_json, group_name)
values
  ('business_name', jsonb_build_object('value', 'Way2Pets'), 'contact'),
  ('phone', jsonb_build_object('value', '7376126261'), 'contact'),
  ('whatsapp', jsonb_build_object('value', '917376126261'), 'contact'),
  ('email', jsonb_build_object('value', 'way2pets.com@gmail.com'), 'contact'),
  ('notification_email', jsonb_build_object('value', 'way2pets.com@gmail.com'), 'notifications'),
  ('address', jsonb_build_object('value', '1/673, Vishal Khand 1, Vishal Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010, India'), 'contact'),
  ('address_line_1', jsonb_build_object('value', '1/673, Vishal Khand 1'), 'contact'),
  ('address_line_2', jsonb_build_object('value', 'Vishal Khand, Gomti Nagar'), 'contact'),
  ('city', jsonb_build_object('value', 'Lucknow'), 'contact'),
  ('state', jsonb_build_object('value', 'Uttar Pradesh'), 'contact'),
  ('pin_code', jsonb_build_object('value', '226010'), 'contact'),
  ('postal_code', jsonb_build_object('value', '226010'), 'contact'),
  ('country', jsonb_build_object('value', 'India'), 'contact'),
  ('google_maps_embed_url', jsonb_build_object('value', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.6646399432646!2d80.9965!3d26.8505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDUxJzAxLjgiTiA4MMKwNTknNDcuNCJF!5e0!3m2!1sen!2sin!4v1620000000000'), 'maps'),
  ('google_maps_public_url', jsonb_build_object('value', 'https://www.google.com/maps/search/?api=1&query=Way2Pets%20Lucknow'), 'maps'),
  ('google_business_profile_url', jsonb_build_object('value', 'https://www.google.com/search?q=Way2Pets+Lucknow'), 'maps'),
  ('facebook_url', jsonb_build_object('value', 'https://www.facebook.com/way2pets/'), 'social'),
  ('instagram_url', jsonb_build_object('value', 'https://www.instagram.com/way2petslko/'), 'social'),
  ('latitude', jsonb_build_object('value', 26.8505), 'maps'),
  ('longitude', jsonb_build_object('value', 80.9965), 'maps'),
  ('default_seo_title', jsonb_build_object('value', 'Way2Pets Lucknow | Dog & Cat Boarding, Grooming, Pet Shop'), 'seo'),
  ('default_seo_description', jsonb_build_object('value', 'Way2Pets offers cage-free dog and cat boarding, grooming, natural pet food, puppies, kittens and pet care guidance in Lucknow.'), 'seo')
on conflict (key) do update set
  value_json = excluded.value_json,
  group_name = excluded.group_name,
  updated_at = now();

insert into public.redirects (source_path, destination_path, status_code, is_active)
values
  ('/contactus', '/contact', 301, true),
  ('/lucknow-dog-boarding.html', '/dog-boarding-in-lucknow', 301, true),
  ('/dog-boarding-lucknow', '/dog-boarding-in-lucknow', 301, true),
  ('/cat-boarding-lucknow', '/cat-boarding-in-lucknow', 301, true),
  ('/pet-shop-lucknow', '/pet-shop-in-lucknow', 301, true),
  ('/pet-store-lucknow', '/pet-store-in-lucknow', 301, true)
on conflict (source_path) do update set
  destination_path = excluded.destination_path,
  status_code = excluded.status_code,
  is_active = excluded.is_active,
  updated_at = now();

notify pgrst, 'reload schema';
