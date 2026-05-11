'use client'

import Link from 'next/link'
import Image from 'next/image'
import Hero from '@/components/Hero'
import ContactForm, { type ContactFormCmsContent } from '@/components/ContactForm'
import LanguageSeo from '@/components/LanguageSeo'
import { localized, metadataNumber, metadataText, type WebsiteContent } from '@/lib/website-content'
import { useI18n } from '@/src/i18n'

type Review = { id?: string; review_text: string; reviewer_name: string; rating?: number }

type DisplayReview = Review & { localizedText?: string }

export default function HomePageContent({ featuredReviews, websiteContent }: { featuredReviews: Review[]; websiteContent: WebsiteContent }) {
  const { language, t } = useI18n()
  const hero = websiteContent.sections.hero
  const ourStory = websiteContent.sections.our_story
  const difference = websiteContent.sections.difference
  const services = websiteContent.sections.services
  const testimonials = websiteContent.sections.testimonials
  const contact = websiteContent.sections.contact
  const featureCards = websiteContent.items.feature_cards || []
  const differenceCards = websiteContent.items.difference || []
  const serviceCards = websiteContent.items.services || []
  const cmsReviews: DisplayReview[] = (websiteContent.items.testimonials || []).map((review) => ({
    id: review.item_key,
    reviewer_name: localized(review, 'title', language),
    review_text: localized(review, 'description', language),
    localizedText: localized(review, 'description', language),
    rating: metadataNumber(review, 'rating', 5),
  }))
  const reviews: DisplayReview[] = featuredReviews.length > 0 ? featuredReviews : (cmsReviews.length > 0 ? cmsReviews : t.home.fallbackReviews.map((review) => ({ ...review, rating: 5 })))
  const contactMetadata = contact?.metadata_json || {}
  const contactFormContent: ContactFormCmsContent = {
    submit: localized(contact, 'button_text', language, t.contactForm.submit),
    topics: {
      boarding: metadataText(contact, `topic_boarding_${language}`, t.contactForm.topics.boarding),
      product: metadataText(contact, `topic_product_${language}`, t.contactForm.topics.product),
      grooming: metadataText(contact, `topic_grooming_${language}`, t.contactForm.topics.grooming),
      other: metadataText(contact, `topic_other_${language}`, t.contactForm.topics.other),
    },
  }

  return (
    <>
      <LanguageSeo />
      <Hero
        title={localized(hero, 'title', language, t.hero.title)}
        subtitle={localized(hero, 'subtitle', language, t.hero.subtitle)}
        imageUrl={hero?.image_url || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'}
        minHeight="100vh"
        buttonText={localized(hero, 'button_text', language)}
        buttonLink={hero?.button_link || ''}
      />

      <section className="features">
        <div className="features-container">
          {featureCards.map((card) => (
            <div className="feature-item" key={card.item_key}>
              <i className={card.icon_key || 'fas fa-paw'}></i>
              <div><strong>{localized(card, 'title', language)}</strong><br /><small>{localized(card, 'subtitle', language)}</small></div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: 'var(--section-padding)', background: 'var(--white)' }}>
        <div className="founder">
          <div className="founder-img">
            <Image
              src={ourStory?.image_url || 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
              alt={metadataText(ourStory, `image_alt_${language}`, t.home.founderAlt)}
              width={800}
              height={600}
            />
          </div>
          <div className="founder-text">
            <h2>{localized(ourStory, 'title', language, t.sections.ourStoryPrefix)} <span className="highlight">{localized(ourStory, 'subtitle', language, t.sections.ourStoryHighlight)}</span></h2>
            <p>{metadataText(ourStory, `paragraph1_${language}`, `${t.home.founderPara1Start} ${t.home.founderName}, ${t.home.founderPara1End}`)}</p>
            <p style={{ margin: '15px 0' }}>{metadataText(ourStory, `paragraph2_${language}`, t.home.founderPara2)}</p>
            <p>{metadataText(ourStory, `paragraph3_${language}`, t.home.founderPara3)}</p>
            <Link href={ourStory?.button_link || '/contact'} className="btn btn-primary" style={{ marginTop: '25px', display: 'inline-block' }}>
              {localized(ourStory, 'button_text', language, t.home.meetTeam)}
            </Link>
          </div>
        </div>
      </section>

      <section className="difference">
        <h2>{localized(difference, 'title', language, t.sections.way2PetsDifference)}</h2>
        <div className="diff-grid">
          {differenceCards.map((card) => (
            <div className="diff-card" key={card.item_key}>
              <h3>{localized(card, 'title', language)}</h3>
              <p>{localized(card, 'description', language)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="services">
        <h2>{localized(services, 'title', language, t.sections.whatWeOffer)}</h2>
        <div className="services-grid">
          {serviceCards.map((card) => (
            <div className="service-card" key={card.item_key}>
              <Image
                src={card.image_url || 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                alt={metadataText(card, `image_alt_${language}`, localized(card, 'title', language))}
                width={800}
                height={520}
              />
              <div className="service-content">
                <h3>{localized(card, 'title', language)}</h3>
                <p>{localized(card, 'description', language)}</p>
                <Link href={card.button_link || '/contact'} className="btn btn-secondary" style={{ marginTop: 'auto' }}>
                  {localized(card, 'button_text', language)}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="reviews">
        <h2>{localized(testimonials, 'title', language, t.sections.petParentsSay)}</h2>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div className="review-card" key={review.id || review.reviewer_name}>
              <p>&ldquo;{review.localizedText || review.review_text}&rdquo;</p>
              <div className="stars">{'★'.repeat(review.rating || 5)}</div>
              <div className="reviewer">- <span style={{ fontWeight: 600 }}>{review.reviewer_name}</span></div>
            </div>
          ))}
        </div>
        <Link href={testimonials?.button_link || '/reviews'} className="btn btn-primary" style={{ marginTop: '40px', display: 'inline-block' }}>
          {localized(testimonials, 'button_text', language, t.home.readAllReviews)}
        </Link>
      </section>

      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <div>
              <h3>{localized(contact, 'title', language, t.sections.visitUs)}</h3>
              <p>{localized(contact, 'subtitle', language, t.home.visitText)}</p>
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>{String(contactMetadata.address || '1/673, Vishal Khand 1, Gomti Nagar, Lucknow, UP 226010')}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-phone-alt"></i>
                <span>{String(contactMetadata.phone || '+91 73761 26261')}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-envelope"></i>
                <span>{String(contactMetadata.email || 'care@way2pets.com')}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-clock"></i>
                <span>{metadataText(contact, `timing_${language}`, t.home.hours)}</span>
              </div>
            </div>
          </div>
          <div className="contact-form-wrapper">
            <h3>{metadataText(contact, `form_heading_${language}`, t.sections.sendMessage)}</h3>
            <ContactForm content={contactFormContent} />
          </div>
        </div>
      </section>
    </>
  )
}
