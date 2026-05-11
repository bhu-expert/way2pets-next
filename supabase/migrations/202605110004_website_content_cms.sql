-- Adds editable public website content tables and seeds current homepage/footer CTA content.

create table if not exists public.website_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title_en text,
  title_hi text,
  subtitle_en text,
  subtitle_hi text,
  description_en text,
  description_hi text,
  image_url text,
  button_text_en text,
  button_text_hi text,
  button_link text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.website_section_items (
  id uuid primary key default gen_random_uuid(),
  section_key text not null,
  item_key text not null,
  title_en text,
  title_hi text,
  subtitle_en text,
  subtitle_hi text,
  description_en text,
  description_hi text,
  image_url text,
  icon_key text,
  button_text_en text,
  button_text_hi text,
  button_link text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint website_section_items_unique_key unique (section_key, item_key)
);

create index if not exists website_sections_active_order_idx on public.website_sections (is_active, sort_order);
create index if not exists website_section_items_section_active_order_idx on public.website_section_items (section_key, is_active, sort_order);

drop trigger if exists set_website_sections_updated_at on public.website_sections;
create trigger set_website_sections_updated_at before update on public.website_sections for each row execute function public.set_updated_at();

drop trigger if exists set_website_section_items_updated_at on public.website_section_items;
create trigger set_website_section_items_updated_at before update on public.website_section_items for each row execute function public.set_updated_at();

alter table public.website_sections enable row level security;
alter table public.website_section_items enable row level security;

drop policy if exists "public read active website sections" on public.website_sections;
create policy "public read active website sections" on public.website_sections for select using (is_active = true);

drop policy if exists "public read active website section items" on public.website_section_items;
create policy "public read active website section items" on public.website_section_items for select using (is_active = true);

drop policy if exists "authenticated manage website sections" on public.website_sections;
create policy "authenticated manage website sections" on public.website_sections for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "authenticated manage website section items" on public.website_section_items;
create policy "authenticated manage website section items" on public.website_section_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into public.website_sections (section_key,title_en,title_hi,subtitle_en,subtitle_hi,description_en,description_hi,image_url,button_text_en,button_text_hi,button_link,is_active,sort_order,metadata_json)
values
('hero','Lucknow''s Natural Pet Care Experts','लखनऊ के नेचुरल पेट केयर एक्सपर्ट्स','Natural food. Cage-free boarding. Ethical adoption. Because your pet deserves the best.','नेचुरल फूड, केज-फ्री बोर्डिंग और सही पेट गाइडेंस — क्योंकि आपका पेट बेस्ट केयर deserve करता है।',null,null,'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80','','','',true,10,'{}'),
('our_story','Our Story:','हमारी कहानी:','From Passion to Purpose','Passion से Purpose तक',null,null,'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80','Meet the Team','टीम से मिलें','/contact',true,30,'{"paragraph1_en":"Way2Pets was founded by Ashish, a lifelong animal lover who was frustrated by the lack of honest, natural pet care options in Lucknow.","paragraph1_hi":"Way2Pets की शुरुआत Ashish ने की, जो animal lover हैं और लखनऊ में ईमानदार, नेचुरल पेट केयर options की कमी से परेशान थे।","paragraph2_en":"After years of researching dog nutrition and holistic health, he started Way2Pets with a simple mission: to give every pet the life they deserve — free from cages, processed food, and harmful chemicals.","paragraph2_hi":"Dog nutrition और holistic health पर सालों की research के बाद उन्होंने Way2Pets शुरू किया, एक simple mission के साथ: हर पेट को cages, processed food और harmful chemicals से दूर बेहतर life देना।","paragraph3_en":"Today, Way2Pets is trusted by hundreds of pet families across Lucknow for boarding, adoption, and natural food guidance.","paragraph3_hi":"आज Lucknow की सैकड़ों pet families boarding, adoption और natural food guidance के लिए Way2Pets पर भरोसा करती हैं।","image_alt_en":"Ashish - Founder of Way2Pets","image_alt_hi":"Ashish - Way2Pets के फाउंडर"}'),
('difference','The Way2Pets Difference','Way2Pets का फर्क',null,null,null,null,null,null,null,null,true,40,'{}'),
('services','What We Offer','हम क्या ऑफर करते हैं',null,null,null,null,null,null,null,null,true,50,'{}'),
('testimonials','What Pet Parents Say','पेट पेरेंट्स क्या कहते हैं',null,null,null,null,null,'Read All Reviews','सभी रिव्यू पढ़ें','/reviews',true,60,'{}'),
('contact','Visit Us','हमसे मिलें','Experience the difference in pet care.','पेट केयर का फर्क खुद experience करें।',null,null,null,'Submit Inquiry','पूछताछ भेजें',null,true,70,'{"address":"1/673, Vishal Khand 1, Gomti Nagar, Lucknow, UP 226010","phone":"+91 73761 26261","email":"care@way2pets.com","timing_en":"Mon–Sun: 10:00 AM – 8:00 PM","timing_hi":"Mon–Sun: सुबह 10:00 – रात 8:00","form_heading_en":"Send Us a Message","form_heading_hi":"हमें मैसेज भेजें","topic_boarding_en":"Boarding Inquiry","topic_boarding_hi":"बोर्डिंग पूछताछ","topic_product_en":"Product Inquiry","topic_product_hi":"प्रोडक्ट पूछताछ","topic_grooming_en":"Grooming Appointment","topic_grooming_hi":"ग्रूमिंग अपॉइंटमेंट","topic_other_en":"Other","topic_other_hi":"अन्य"}'),
('footer',null,null,null,null,'Natural food, cage-free boarding, ethical adoption and holistic care for pets in Lucknow.','लखनऊ में pets के लिए नेचुरल फूड, केज-फ्री बोर्डिंग, सही अडॉप्शन और holistic care.',null,null,null,null,true,90,'{"phone":"+91 73761 26261","whatsapp":"917376126261","email":"care@way2pets.com","facebook":"https://www.facebook.com/way2pets/","instagram":"https://www.instagram.com/way2petslko/","copyright_en":"© 2024 Way2Pets.com. All rights reserved.","copyright_hi":"© 2024 Way2Pets.com. सभी अधिकार सुरक्षित।"}')
on conflict (section_key) do update set title_en=excluded.title_en,title_hi=excluded.title_hi,subtitle_en=excluded.subtitle_en,subtitle_hi=excluded.subtitle_hi,description_en=excluded.description_en,description_hi=excluded.description_hi,image_url=excluded.image_url,button_text_en=excluded.button_text_en,button_text_hi=excluded.button_text_hi,button_link=excluded.button_link,is_active=excluded.is_active,sort_order=excluded.sort_order,metadata_json=excluded.metadata_json;

insert into public.website_section_items (section_key,item_key,title_en,title_hi,subtitle_en,subtitle_hi,description_en,description_hi,image_url,icon_key,button_text_en,button_text_hi,button_link,is_active,sort_order,metadata_json)
values
('feature_cards','natural_food','Natural Food','नेचुरल फूड','No processed kibble','प्रोसेस्ड किबल नहीं',null,null,null,'fas fa-seedling',null,null,null,true,10,'{}'),
('feature_cards','cage_free_boarding','Cage-Free Boarding','केज-फ्री बोर्डिंग','Home-like stay','घर जैसा स्टे',null,null,null,'fas fa-home',null,null,null,true,20,'{}'),
('feature_cards','ethical_adoption','Ethical Adoption','सही अडॉप्शन','Happy, healthy pets','खुश और हेल्दी पेट्स',null,null,null,'fas fa-heart',null,null,null,true,30,'{}'),
('feature_cards','holistic_care','Holistic Care','होलिस्टिक केयर','Homeopathy & wellness','होम्योपैथी और वेलनेस',null,null,null,'fas fa-user-md',null,null,null,true,40,'{}'),
('difference','no_cages','No Cages. Ever.','कभी Cages नहीं।',null,null,'Our boarding facility is 100% cage-free. Dogs sleep on beds and sofas, play freely, and are treated like family members.','हमारी boarding facility 100% cage-free है। Dogs beds और sofas पर सोते हैं, freely play करते हैं और family members जैसे care पाते हैं।',null,null,null,null,null,true,10,'{}'),
('difference','real_food','Real Food, Real Health','Real Food, Real Health',null,null,'We feed pets fresh meat, eggs, and vegetables — the diet they evolved to eat. No preservatives, no fillers.','हम pets को fresh meat, eggs और vegetables देते हैं — वही diet जिसके लिए वे naturally बने हैं। No preservatives, no fillers.',null,null,null,null,null,true,20,'{}'),
('difference','trust','Knowledge You Can Trust','भरोसेमंद Knowledge',null,null,'Our founder has 15+ years of hands-on experience with dog behavior, nutrition, and holistic healing. We don''t just sell — we educate.','हमारे founder के पास dog behavior, nutrition और holistic healing का 15+ years hands-on experience है। हम सिर्फ sell नहीं करते — educate करते हैं।',null,null,null,null,null,true,30,'{}'),
('services','boarding','Cage-Free Boarding','केज-फ्री बोर्डिंग',null,null,'Leave your dog with us while you travel. Daily videos, natural food, playtime, and a real home environment.','Travel के दौरान अपना dog हमारे साथ छोड़ें। Daily videos, natural food, playtime और real home environment.','https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',null,'Book Now','अभी बुक करें','/boarding',true,10,'{"image_alt_en":"Dog boarding in a home-style Way2Pets environment","image_alt_hi":"Way2Pets के home-style environment में dog boarding"}'),
('services','find_pet','Find Your Pet','अपना पेट खोजें',null,null,'Adopt a healthy, socialized puppy or kitten. Breed guidance, diet plans, and lifetime support included.','Healthy, socialized puppy या kitten adopt करें। Breed guidance, diet plans और lifetime support included.','https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',null,'Browse Pets','Pets देखें','/find-a-pet',true,20,'{"image_alt_en":"Healthy puppy and kitten guidance at Way2Pets Lucknow","image_alt_hi":"Way2Pets Lucknow में healthy puppy और kitten guidance"}'),
('services','natural_pet_food','Natural Pet Food','नेचुरल पेट फूड',null,null,'Fresh, species-appropriate food for dogs and cats. Made with real ingredients and zero preservatives.','Dogs और cats के लिए fresh, species-appropriate food. Real ingredients और zero preservatives के साथ।','https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',null,'Enquire Now','अभी पूछें','/contact',true,30,'{"image_alt_en":"Natural pet food guidance for dogs and cats in Lucknow","image_alt_hi":"Lucknow में dogs और cats के लिए natural pet food guidance"}'),
('testimonials','manvi_raj','Advocate Manvi Raj','Advocate Manvi Raj',null,null,'Best pet shop in Lucknow. I got a golden retriever puppy who is very healthy and lovely.','Lucknow की best pet shop. मुझे golden retriever puppy मिला जो बहुत healthy और प्यारा है।',null,null,null,null,null,true,10,'{"rating":5}'),
('testimonials','ramita','Ramita','Ramita',null,null,'An amazing place like home for your dogs. I always fall back on Way2Pets if I ever need anything.','आपके dogs के लिए home जैसा amazing place. मुझे कुछ भी चाहिए हो तो मैं हमेशा Way2Pets पर भरोसा करती हूं।',null,null,null,null,null,true,20,'{"rating":5}'),
('testimonials','varun_garg','Varun Garg','Varun Garg',null,null,'Ashish is very nice. He has in-depth knowledge about dogs and takes care of your pets like his own.','Ashish बहुत अच्छे हैं। उन्हें dogs की deep knowledge है और वे आपके pets को अपने जैसा care करते हैं।',null,null,null,null,null,true,30,'{"rating":5}'),
('floating_buttons','call_now','Call Now','कॉल करें',null,null,null,null,null,null,null,null,'tel:+917376126261',true,10,'{}'),
('floating_buttons','whatsapp','WhatsApp','WhatsApp',null,null,null,null,null,null,null,null,'https://wa.me/917376126261',true,20,'{}'),
('floating_buttons','book_boarding','Book Boarding','बोर्डिंग बुक करें',null,null,null,null,null,null,null,null,'/pet-boarding-for-cat-and-dog-in-lucknow',true,30,'{}')
on conflict (section_key,item_key) do update set title_en=excluded.title_en,title_hi=excluded.title_hi,subtitle_en=excluded.subtitle_en,subtitle_hi=excluded.subtitle_hi,description_en=excluded.description_en,description_hi=excluded.description_hi,image_url=excluded.image_url,icon_key=excluded.icon_key,button_text_en=excluded.button_text_en,button_text_hi=excluded.button_text_hi,button_link=excluded.button_link,is_active=excluded.is_active,sort_order=excluded.sort_order,metadata_json=excluded.metadata_json;
