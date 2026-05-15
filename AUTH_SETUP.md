# Way2Pets Auth Setup

## SQL migration execution order

Run migrations in filename order and include:

1. `supabase/migrations/202605140005_user_accounts_and_ownership.sql`

The migration is safe to run multiple times: it uses `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`, policy existence checks, and `notify pgrst, 'reload schema';`.

## Environment variables

Existing variables continue to be used:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only; never expose to the browser)
- `ADMIN_EMAIL`
- `EMAIL_USER`
- `EMAIL_PASS`
- `NOTIFICATION_EMAIL` (optional fallback after `site_settings.notification_email`)

No Google client secret is needed in the Next.js app. Store Google OAuth credentials only in Supabase Auth provider settings.

## Supabase Auth settings

1. Enable email/password signups if customer self-registration should be public.
2. Set Site URL to the production domain, for example `https://way2pets.com`.
3. Add Redirect URLs for local, Vercel, and production callback/reset pages:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/reset-password`
   - `https://way2pets-next.vercel.app/auth/callback`
   - `https://way2pets-next.vercel.app/reset-password`
   - `https://way2pets.com/auth/callback`
   - `https://way2pets.com/reset-password`

## Google OAuth setup

1. Supabase Dashboard → Authentication → Providers → Google.
2. Enable Google provider.
3. Add the Google Client ID and Client Secret from Google Cloud Console.
4. In Google Cloud Console, configure the OAuth consent screen.
5. Add the authorized redirect URL shown by Supabase for Google provider callbacks.
6. Confirm Supabase Auth Site URL and Redirect URLs include the Way2Pets site URLs above.
7. Test `/login` → Continue with Google → `/auth/callback` → `/account`.

If Google OAuth is not configured, email/password login and signup still work; Google will show a graceful setup error from Supabase or the login page.

## Forgot password setup

1. Keep Supabase email templates enabled.
2. Ensure redirect allow-list includes `/reset-password` URLs.
3. User opens `/forgot-password`, enters email, receives Supabase reset email, opens link, sets a new password on `/reset-password`, then logs in again.

## Access control summary

- Admin access is still based on Supabase Auth plus `ADMIN_EMAIL`.
- Customer account access uses separate user session cookies.
- Account pages call `requireUser()` server-side.
- Admin pages continue to call `requireAdmin()` server-side.
- Public forms insert server-side and attach `user_id` when a customer is logged in.
- Existing guest submissions are linked after signup/login/OAuth by matching email/mobile server-side.
- RLS lets users select/update only their own account rows while service-role admin operations continue server-side.
