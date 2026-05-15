import { redirect } from 'next/navigation'
import AuthShell from '@/components/auth/AuthShell'
import { LoginForm } from '@/components/auth/AuthForms'
import { getCurrentUser } from '@/lib/user-auth'

export default async function LoginPage() {
  if (await getCurrentUser()) redirect('/account')

  return (
    <AuthShell size="login">
      <LoginForm />
    </AuthShell>
  )
}
