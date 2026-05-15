import AuthShell from '@/components/auth/AuthShell'
import { ResetPasswordForm } from '@/components/auth/AuthForms'

export default function ResetPasswordPage() {
  return (
    <AuthShell size="login">
      <ResetPasswordForm />
    </AuthShell>
  )
}
