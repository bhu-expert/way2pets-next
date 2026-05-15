import AuthShell from '@/components/auth/AuthShell'
import { ForgotPasswordForm } from '@/components/auth/AuthForms'

export default function ForgotPasswordPage() {
  return (
    <AuthShell size="login">
      <ForgotPasswordForm />
    </AuthShell>
  )
}
