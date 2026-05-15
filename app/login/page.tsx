import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/auth/AuthForms'
import { getCurrentUser } from '@/lib/user-auth'
export default async function LoginPage() { if (await getCurrentUser()) redirect('/account'); return <section className="section"><div className="container narrow"><LoginForm /></div></section> }
