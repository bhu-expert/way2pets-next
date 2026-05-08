import type { Metadata } from 'next'
import { Fredoka, Poppins } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-poppins',
})

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-fredoka',
})

export const metadata: Metadata = {
  title: 'Way2Pets Lucknow | Natural Pet Care, Boarding & Adoption',
  description: "Way2Pets is Lucknow's trusted pet shop for natural dog food, cage-free boarding, puppy adoption, and holistic pet care.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${fredoka.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
