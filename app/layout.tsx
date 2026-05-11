import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StickyCtas from '@/components/StickyCtas'
import { LanguageProvider } from '@/src/i18n'


export const metadata: Metadata = {
  title: 'Way2Pets | Natural Pet Care, Boarding & Pet Adoption in Lucknow',
  description: 'Way2Pets offers cage-free pet boarding, natural pet care, pet adoption guidance and expert dog and cat care in Lucknow.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <StickyCtas />
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
