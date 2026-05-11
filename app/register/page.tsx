import type { Metadata } from 'next'
import RegisterPageContent from '@/components/RegisterPageContent'

export const metadata: Metadata = {
  title: 'Register Your Pet | Way2Pets Lucknow',
  description: 'Register your pet with Way2Pets for better care, reminders, and quick boarding booking. Join our pet parent community.',
}

export default function RegisterPage() {
  return <RegisterPageContent />
}
