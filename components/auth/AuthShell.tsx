import type { ReactNode } from 'react'

type AuthShellProps = {
  children: ReactNode
  size?: 'login' | 'signup'
}

export default function AuthShell({ children, size = 'login' }: AuthShellProps) {
  return (
    <section className="auth-shell" aria-label="Way2Pets account access">
      <div className={`auth-shell__inner auth-shell__inner--${size}`}>{children}</div>
    </section>
  )
}
