import { redirect } from 'next/navigation'
import { SignupForm } from '@/components/auth/AuthForms'
import { getCurrentUser } from '@/lib/user-auth'
export default async function SignupPage() { if (await getCurrentUser()) redirect('/account'); return <section className="section"><div className="container narrow"><SignupForm /></div></section> }
