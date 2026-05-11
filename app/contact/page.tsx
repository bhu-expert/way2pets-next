import type { Metadata } from 'next'
import ContactPageContent from '@/components/ContactPageContent'

export const metadata: Metadata = {
  title: 'Contact Us - Way2Pets Lucknow | Pet Shop',
  description: 'Contact Way2Pets Lucknow for pet boarding, grooming, or adoption. Visit our store or call us for natural pet food and health advice.',
}

export default function ContactPage() {
  return <ContactPageContent />
}
