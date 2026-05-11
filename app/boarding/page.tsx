import type { Metadata } from 'next'
import BoardingPageContent from '@/components/BoardingPageContent'

export const metadata: Metadata = {
  title: 'Pet Boarding Lucknow | Dog Hostel | Way2Pets',
  description: 'Best cage-free dog boarding in Lucknow. Way2Pets offers a home-like environment, natural food, and holistic care. Book your pet\'s stay today.',
}

export default function BoardingPage() {
  return <BoardingPageContent />
}
