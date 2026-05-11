'use client'

import Link from 'next/link'
import BoardingForm from '@/components/BoardingForm'
import { JsonLd, faqSchema, localBusinessSchema } from '@/lib/seo'
import { siteConfig } from '@/lib/site'
import { useI18n } from '@/src/i18n'

export interface LandingPageContent {
  h1: string
  intro: string
  serviceDetails: string[]
  path: string
  ctaLabel?: string
  faqs?: Array<{ question: string; answer: string }>
  schemaType?: string
}

export default function SeoLandingPage({ content }: { content: LandingPageContent }) {
  const { language, t } = useI18n()
  const localizedContent = language === 'hi' && content.path === '/pet-boarding-for-cat-and-dog-in-lucknow' ? t.seoLanding.boardingPage : content
  const faqs = content.faqs || t.seoLanding.defaultFaqs.map((faq, index) => ({
    ...faq,
    answer: index === 1 ? `${faq.answer} ${siteConfig.shortAddress}.` : faq.answer,
  }))

  return (
    <>
      <JsonLd data={localBusinessSchema(content.path)} />
      <JsonLd data={faqSchema(faqs)} />
      <section className="seo-hero">
        <div>
          <p className="eyebrow">{t.seoLanding.eyebrow}</p>
          <h1>{localizedContent.h1}</h1>
          <p>{localizedContent.intro}</p>
          <div className="seo-cta-row">
            <a className="btn btn-primary" href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer">{t.common.whatsapp}</a>
            <a className="btn btn-secondary" href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}>{t.common.callNow}</a>
          </div>
        </div>
      </section>

      <section className="services">
        <h2>{t.seoLanding.whyTrust}</h2>
        <div className="services-grid">
          {localizedContent.serviceDetails.map((detail) => (
            <article className="service-card text-card" key={detail}>
              <div className="service-content"><h3>{detail}</h3><p>{t.seoLanding.cardText}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <h3>{t.seoLanding.bookEnquire}</h3>
            <p>{siteConfig.shortAddress}</p>
            <p>{siteConfig.phone}</p>
            <p>{siteConfig.hours}</p>
            <div className="seo-internal-links">
              <Link href="/dog-boarding-in-lucknow">{t.seoLanding.dogBoarding}</Link>
              <Link href="/cat-boarding-in-lucknow">{t.seoLanding.catBoarding}</Link>
              <Link href="/gallery">{t.common.gallery}</Link>
              <Link href="/reviews">{t.common.reviews}</Link>
            </div>
          </div>
          <div className="contact-form-wrapper">
            <h3>{content.ctaLabel || t.seoLanding.requestBoarding}</h3>
            <BoardingForm />
          </div>
        </div>
      </section>

      <section className="reviews">
        <h2>{t.common.faqs}</h2>
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
