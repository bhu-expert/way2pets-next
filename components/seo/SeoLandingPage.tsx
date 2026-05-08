import Link from 'next/link'
import BoardingForm from '@/components/BoardingForm'
import { JsonLd, faqSchema, localBusinessSchema } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export interface LandingPageContent {
  h1: string
  intro: string
  serviceDetails: string[]
  path: string
  ctaLabel?: string
  faqs?: Array<{ question: string; answer: string }>
  schemaType?: string
}

const defaultFaqs = [
  {
    question: 'Does Way2Pets provide dog and cat boarding in Lucknow?',
    answer: 'Yes. Way2Pets provides home-style dog and cat boarding support in Lucknow with experienced handlers, hygiene, daily care and owner updates.',
  },
  {
    question: 'Where is Way2Pets located?',
    answer: `Way2Pets is based in Gomti Nagar, Lucknow at ${siteConfig.shortAddress}.`,
  },
  {
    question: 'How can I book a service?',
    answer: 'You can call, WhatsApp, submit the boarding form or send a contact enquiry. The team will confirm availability and next steps.',
  },
]

export default function SeoLandingPage({ content }: { content: LandingPageContent }) {
  const faqs = content.faqs || defaultFaqs

  return (
    <>
      <JsonLd data={localBusinessSchema(content.path)} />
      <JsonLd data={faqSchema(faqs)} />
      <section className="seo-hero">
        <div>
          <p className="eyebrow">Way2Pets Gomti Nagar, Lucknow</p>
          <h1>{content.h1}</h1>
          <p>{content.intro}</p>
          <div className="seo-cta-row">
            <a className="btn btn-primary" href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp Now</a>
            <a className="btn btn-secondary" href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}>Call Now</a>
          </div>
        </div>
      </section>

      <section className="services">
        <h2>Why pet parents trust Way2Pets</h2>
        <div className="services-grid">
          {content.serviceDetails.map((detail) => (
            <article className="service-card text-card" key={detail}>
              <div className="service-content"><h3>{detail}</h3><p>Local Lucknow pet care focused on safety, comfort, hygiene and practical guidance for dog and cat families.</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <h3>Book or enquire today</h3>
            <p>{siteConfig.shortAddress}</p>
            <p>{siteConfig.phone}</p>
            <p>{siteConfig.hours}</p>
            <div className="seo-internal-links">
              <Link href="/dog-boarding-in-lucknow">Dog Boarding</Link>
              <Link href="/cat-boarding-in-lucknow">Cat Boarding</Link>
              <Link href="/gallery">Gallery</Link>
              <Link href="/reviews">Reviews</Link>
            </div>
          </div>
          <div className="contact-form-wrapper">
            <h3>{content.ctaLabel || 'Request Boarding'}</h3>
            <BoardingForm />
          </div>
        </div>
      </section>

      <section className="reviews">
        <h2>FAQs</h2>
        <div className="reviews-grid">
          {faqs.map((faq) => (
            <article className="review-card" key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
