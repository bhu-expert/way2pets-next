import { redirect } from 'next/navigation'
import AuthShell from '@/components/auth/AuthShell'
import { SignupForm } from '@/components/auth/AuthForms'
import { getCurrentUser } from '@/lib/user-auth'

export default async function SignupPage() {
  if (await getCurrentUser()) redirect('/account')

  return (
    <AuthShell size="signup">
      <SignupForm />
    </AuthShell>
  )
}
