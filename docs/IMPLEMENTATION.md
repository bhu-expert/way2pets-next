# Way2Pets implementation setup

## What was added

This phase adds the Supabase/Cloudinary foundation, protected admin scaffolding, database schema SQL, validated public form APIs, SEO landing routes, dog/cat article routes, sitemap, robots, redirects, gallery route, pet detail route, thank-you pages and conversion CTAs.

## Environment variables

Copy `.env.example` to `.env.local` locally and configure the same values in Vercel:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `EMAIL_USER`
- `EMAIL_PASS`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

The service role key is only used in server routes and must never be exposed to client components.

## Supabase setup

1. Create a Supabase project on the free tier.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Create one user in Supabase Auth for the admin.
5. Set `ADMIN_EMAIL` to that exact user's email.
6. Add the Supabase URL, anon key and service role key to Vercel environment variables.

## Tables created by the schema

- `pages`
- `page_sections`
- `seo_metadata`
- `blog_posts`
- `blog_categories`
- `pets`
- `pet_registrations`
- `boarding_bookings`
- `contact_leads`
- `gallery_images`
- `reviews`
- `media_assets`
- `redirects`
- `site_settings`
- `payment_records`

## Cloudinary setup

1. Create a Cloudinary account.
2. Copy cloud name, API key and API secret into Vercel and `.env.local`.
3. Use `/admin/gallery` as the admin area for gallery/media management.
4. Uploads are handled by `POST /api/admin/media/upload`, which stores Cloudinary metadata in `media_assets`.
5. Public image delivery should use Cloudinary `secure_url` or transformation URLs and `next/image`.

## First admin login

1. Create the admin user in Supabase Auth.
2. Ensure the email matches `ADMIN_EMAIL`.
3. Visit `/admin/login`.
4. Log in with the Supabase Auth email/password.
5. Protected admin routes are guarded by `proxy.ts` and server-side admin validation.

## Local development

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Production checks

```bash
npm run lint
npm run build
```

## Form testing

Test these public forms after Supabase and email env vars are configured:

- Contact form: `/contact`
- Boarding form: `/pet-boarding-for-cat-and-dog-in-lucknow`
- Pet registration form: `/register`
- Find-a-pet inquiry: `/find-a-pet`

Expected behavior:

1. Server validates input.
2. Data is inserted into Supabase.
3. Email notification is sent when email env vars are configured.
4. User is redirected to a thank-you page.

## Add a blog article

Insert a `blog_posts` row with:

- `title`
- `slug`
- `full_path`, for example `/dogs/breeds/top-10-dog-breeds-in-india`
- `pet_type`
- `excerpt`
- `content_markdown`
- `status = published`
- `published_at <= now()`

Public dynamic routes are:

- `/dogs/[category]/[slug]`
- `/cats/[category]/[slug]`

## Upload gallery images

Use the admin media upload endpoint or future gallery UI to upload to Cloudinary. Required metadata:

- category
- title
- alt text
- caption
- Cloudinary `public_id`
- Cloudinary `secure_url`
- width/height/format/resource type

## SEO checklist

- Confirm `NEXT_PUBLIC_SITE_URL` is the production domain.
- Submit `/sitemap.xml` in Google Search Console.
- Confirm `/robots.txt` allows public pages and blocks `/admin` and `/api`.
- Verify `/boarding` redirects to `/pet-boarding-for-cat-and-dog-in-lucknow`.
- Add unique metadata and schema for every admin-managed landing page.
- Add FAQ blocks and internal links to every SEO landing page.
- Add alt text for every Cloudinary image.

## Remaining work

- Build full CRUD forms for every admin module.
- Add rich text/markdown editor for blog posts.
- Add editable page-section builder.
- Add gallery upload UI on `/admin/gallery`.
- Add pet CRUD UI and image picker.
- Add booking detail editing and receipt generation.
- Add redirect lookup from the database in addition to static redirects.
- Add Search Console/analytics reporting.
