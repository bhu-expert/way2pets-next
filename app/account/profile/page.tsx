import { ProfileForm } from '@/components/account/ProfileForm'
import { getProfile } from '@/lib/account-data'
import { requireUser } from '@/lib/user-auth'
export default async function ProfilePage() { const user = await requireUser(); return <ProfileForm profile={await getProfile(user.id)} email={user.email} /> }
