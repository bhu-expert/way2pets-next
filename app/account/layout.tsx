import { AccountShell } from '@/components/account/AccountShell'
import { requireUser } from '@/lib/user-auth'
export default async function Layout({ children }: { children: React.ReactNode }) { await requireUser(); return <AccountShell>{children}</AccountShell> }
