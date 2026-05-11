# Way2Pets CMS Testing Checklist

## Gallery upload
1. Log in at `/admin/login` as the email in `ADMIN_EMAIL`.
2. Open `/admin/gallery`.
3. Select any dog/cat image.
4. Enter:
   - Title: `Dog Summer Fruits`
   - Caption: `Dog fruits to eat in summer`
   - Alt text: `Dog fruits to eat in summer at Way2Pets`
   - Category: `blog`
   - Subcategory: `dog-health`
   - Visible: checked
   - Featured: unchecked
   - Sort order: `0`
5. Click **Save gallery image**.
6. Confirm the success message appears and the image preview renders.
7. Confirm Cloudinary contains the file under `way2pets/blog`.
8. Confirm Supabase has one new `media_assets` row and one new `gallery_images` row.
9. Confirm `/admin/gallery` lists the record.
10. Confirm `/gallery` shows the visible image.

## Pet image upload
1. Upload one or more pet images through `/api/admin/media/upload` or the admin media upload UI.
2. Copy/select the generated media asset IDs in `/admin/pets/new`.
3. Save a published, available pet with a slug.
4. Confirm Supabase `pets.image_ids` and `pets.featured_image_id` were saved.
5. Confirm `/find-a-pet` shows the pet and `/pets/[slug]` opens.

## Blog publishing
1. Open `/admin/blog/new`.
2. Add an article with title `Top 10 Dog Breeds in India`, category `dogs`, subcategory `breeds`, slug `top-10-dog-breeds-in-india`, and status `published`.
3. Confirm the generated full path is `/dogs/breeds/top-10-dog-breeds-in-india`.
4. Confirm the public URL opens and draft posts do not render publicly.

## Review CSV upload
1. Open `/admin/reviews`.
2. Download the sample CSV template.
3. Upload a CSV with columns `reviewer_name,rating,review_text,source,source_url,reviewed_at,status,is_featured`.
4. Confirm invalid rows show validation errors.
5. Confirm valid rows are inserted into Supabase and published reviews appear on `/reviews`.

## Public forms and email
1. Submit contact, boarding, pet registration, and find-a-pet forms from public pages.
2. Confirm each submission creates the expected Supabase row.
3. Confirm the matching admin list shows the submission.
4. Confirm email notification goes to `site_settings.notification_email`, `NOTIFICATION_EMAIL`, `way2pets.com@gmail.com`, or `ADMIN_EMAIL` in that order.
5. If email is unavailable, confirm the user still sees success after the DB row is saved.
