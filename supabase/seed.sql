-- Way2Pets CMS seed data. Safe to run multiple times.

insert into public.blog_categories (name, slug, pet_type, description, status)
values
  ('Dog Boarding', 'boarding', 'dog', 'Dog boarding articles and Lucknow boarding guides.', 'published'),
  ('Dog Breeds', 'breeds', 'dog', 'Dog breed guides for Indian families.', 'published'),
  ('Dog Health', 'health', 'dog', 'Dog health and wellness articles.', 'published'),
  ('Dog Grooming', 'grooming', 'dog', 'Dog grooming guides.', 'published'),
  ('Dog Behaviour Training', 'behaviour-training', 'dog', 'Dog behaviour and training guides.', 'published'),
  ('Puppies', 'puppies', 'dog', 'Puppy buying and care guides.', 'published'),
  ('Cat Boarding', 'cat-boarding', 'cat', 'Cat boarding articles and Lucknow boarding guides.', 'published'),
  ('Cat Breeds', 'cat-breeds', 'cat', 'Cat breed guides.', 'published'),
  ('Cat Health', 'cat-health', 'cat', 'Cat health and wellness articles.', 'published'),
  ('Cat Grooming', 'cat-grooming', 'cat', 'Cat grooming guides.', 'published'),
  ('Cat Behaviour Training', 'cat-behaviour-training', 'cat', 'Cat behaviour and training guides.', 'published'),
  ('Kittens', 'kittens', 'cat', 'Kitten care guides.', 'published'),
  ('Pet Care', 'pet-care', 'general', 'General pet care articles.', 'published'),
  ('Adoption', 'adoption', 'general', 'Adoption guides.', 'published'),
  ('Buying Guide', 'buying-guide', 'general', 'Pet buying guides.', 'published'),
  ('Lucknow Pet Services', 'lucknow-pet-services', 'general', 'Local pet service guides.', 'published')
on conflict (slug) do update set name = excluded.name, pet_type = excluded.pet_type, description = excluded.description, status = excluded.status;

insert into public.site_settings (key, value_json, group_name)
values
  ('site_name', '{"value":"Way2Pets"}', 'general'),
  ('primary_phone', '{"value":"+91 94150 77162"}', 'contact'),
  ('whatsapp_number', '{"value":"+91 94150 77162"}', 'contact'),
  ('email', '{"value":"way2pets.com@gmail.com"}', 'contact'),
  ('notification_email', '{"value":"way2pets.com@gmail.com"}', 'notifications'),
  ('address', '{"value":"Lucknow, Uttar Pradesh"}', 'contact'),
  ('default_seo_title', '{"value":"Way2Pets Lucknow"}', 'seo'),
  ('default_seo_description', '{"value":"Dog and cat boarding, grooming, pet shop, puppies and kittens in Lucknow."}', 'seo')
on conflict (key) do update set value_json = excluded.value_json, group_name = excluded.group_name;

insert into public.pages (title, slug, route_path, page_type, status, hero_title, hero_subtitle, content_json, published_at)
values
  ('Home', 'home', '/', 'home', 'published', 'Way2Pets', 'Pet boarding, grooming, pet shop and pet care in Lucknow.', '{}', now()),
  ('Contact', 'contact', '/contact', 'page', 'published', 'Contact Way2Pets', 'Talk to us for boarding, grooming, puppies, kittens and pet care.', '{}', now()),
  ('Pet Boarding for Cats and Dogs in Lucknow', 'pet-boarding-for-cat-and-dog-in-lucknow', '/pet-boarding-for-cat-and-dog-in-lucknow', 'service', 'published', 'Pet Boarding for Cats and Dogs in Lucknow', 'Safe, homely boarding for dogs and cats.', '{}', now()),
  ('Dog Boarding in Lucknow', 'dog-boarding-in-lucknow', '/dog-boarding-in-lucknow', 'service', 'published', 'Dog Boarding in Lucknow', 'Trusted dog boarding with experienced handlers.', '{}', now()),
  ('Cat Boarding in Lucknow', 'cat-boarding-in-lucknow', '/cat-boarding-in-lucknow', 'service', 'published', 'Cat Boarding in Lucknow', 'Calm cat boarding and care in Lucknow.', '{}', now()),
  ('Pet Shop in Lucknow', 'pet-shop-in-lucknow', '/pet-shop-in-lucknow', 'service', 'published', 'Pet Shop in Lucknow', 'Pet supplies, guidance and care support.', '{}', now()),
  ('Pet Store in Lucknow', 'pet-store-in-lucknow', '/pet-store-in-lucknow', 'service', 'published', 'Pet Store in Lucknow', 'Quality pet products and support.', '{}', now()),
  ('Dog Grooming in Lucknow', 'dog-grooming-in-lucknow', '/dog-grooming-in-lucknow', 'service', 'published', 'Dog Grooming in Lucknow', 'Grooming for clean, comfortable dogs.', '{}', now()),
  ('Cat Grooming in Lucknow', 'cat-grooming-in-lucknow', '/cat-grooming-in-lucknow', 'service', 'published', 'Cat Grooming in Lucknow', 'Gentle grooming for cats.', '{}', now()),
  ('Puppy for Sale in Lucknow', 'puppy-for-sale-in-lucknow', '/puppy-for-sale-in-lucknow', 'service', 'published', 'Puppy for Sale in Lucknow', 'Healthy puppies with care guidance.', '{}', now()),
  ('Kitten for Sale in Lucknow', 'kitten-for-sale-in-lucknow', '/kitten-for-sale-in-lucknow', 'service', 'published', 'Kitten for Sale in Lucknow', 'Healthy kittens with care guidance.', '{}', now()),
  ('Gallery', 'gallery', '/gallery', 'page', 'published', 'Way2Pets Gallery', 'Photos from Way2Pets.', '{}', now()),
  ('Reviews', 'reviews', '/reviews', 'page', 'published', 'Customer Reviews', 'What pet parents say about Way2Pets.', '{}', now()),
  ('Register Pet', 'register', '/register', 'page', 'published', 'Register Your Pet', 'Register for boarding, grooming, adoption or sale enquiries.', '{}', now()),
  ('Find a Pet', 'find-a-pet', '/find-a-pet', 'page', 'published', 'Find Your Best Friend', 'Discover pets waiting to join your family.', '{}', now())
on conflict (route_path) do update set title = excluded.title, slug = excluded.slug, page_type = excluded.page_type, status = excluded.status, hero_title = excluded.hero_title, hero_subtitle = excluded.hero_subtitle;

insert into public.redirects (source_path, destination_path, status_code, is_active)
values
  ('/boarding', '/pet-boarding-for-cat-and-dog-in-lucknow', 301, true),
  ('/pet-dog-cat-boarding-lucknow', '/pet-boarding-for-cat-and-dog-in-lucknow', 301, true),
  ('/contactus', '/contact', 301, true),
  ('/lucknow-dog-boarding.html', '/dog-boarding-in-lucknow', 301, true),
  ('/dog-boarding-lucknow', '/dog-boarding-in-lucknow', 301, true),
  ('/cat-boarding-lucknow', '/cat-boarding-in-lucknow', 301, true),
  ('/pet-shop-lucknow', '/pet-shop-in-lucknow', 301, true),
  ('/pet-store-lucknow', '/pet-store-in-lucknow', 301, true)
on conflict (source_path) do update set destination_path = excluded.destination_path, status_code = excluded.status_code, is_active = excluded.is_active;
