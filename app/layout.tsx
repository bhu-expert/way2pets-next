import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import StickyCtas from '@/components/StickyCtas'
import { WebsiteContentProvider } from '@/components/WebsiteContentProvider'
import { getWebsiteContent } from '@/lib/website-content'
import { LanguageProvider } from '@/src/i18n'


export const metadata: Metadata = {
  title: 'Way2Pets | Natural Pet Care, Boarding & Pet Adoption in Lucknow',
  description: 'Way2Pets offers cage-free pet boarding, natural pet care, pet adoption guidance and expert dog and cat care in Lucknow.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const websiteContent = await getWebsiteContent()
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
          <WebsiteContentProvider content={websiteContent}>
            <Navbar />
            <main>{children}</main>
            <StickyCtas />
            <Footer />
          </WebsiteContentProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
