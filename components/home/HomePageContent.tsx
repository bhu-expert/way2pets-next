'use client'

import Link from 'next/link'
import Image from 'next/image'
import Hero from '@/components/Hero'
import ContactForm from '@/components/ContactForm'
import LanguageSeo from '@/components/LanguageSeo'
import { useI18n } from '@/src/i18n'

type Review = { id?: string; review_text: string; reviewer_name: string; rating?: number }

export default function HomePageContent({ featuredReviews }: { featuredReviews: Review[] }) {
  const { t } = useI18n()
  const reviews: Review[] = featuredReviews.length > 0 ? featuredReviews : t.home.fallbackReviews.map((review) => ({ ...review, rating: 5 }))

  return (
    <>
      <LanguageSeo />
      <Hero
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        imageUrl="https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        minHeight="100vh"
      />

      <section className="features">
        <div className="features-container">
          <div className="feature-item">
            <i className="fas fa-seedling"></i>
            <div><strong>{t.features.naturalFood}</strong><br /><small>{t.features.noProcessedKibble}</small></div>
          </div>
          <div className="feature-item">
            <i className="fas fa-home"></i>
            <div><strong>{t.features.cageFreeBoarding}</strong><br /><small>{t.features.homeLikeStay}</small></div>
          </div>
          <div className="feature-item">
            <i className="fas fa-heart"></i>
            <div><strong>{t.features.ethicalAdoption}</strong><br /><small>{t.features.happyHealthyPets}</small></div>
          </div>
          <div className="feature-item">
            <i className="fas fa-user-md"></i>
            <div><strong>{t.features.holisticCare}</strong><br /><small>{t.features.homeopathyWellness}</small></div>
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--section-padding)', background: 'var(--white)' }}>
        <div className="founder">
          <div className="founder-img">
            <Image
              src="https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt={t.home.founderAlt}
              width={800}
              height={600}
            />
          </div>
          <div className="founder-text">
            <h2>{t.sections.ourStoryPrefix} <span className="highlight">{t.sections.ourStoryHighlight}</span></h2>
            <p>{t.home.founderPara1Start} <strong>{t.home.founderName}</strong>, {t.home.founderPara1End}</p>
            <p style={{ margin: '15px 0' }}>{t.home.founderPara2}</p>
            <p>{t.home.founderPara3}</p>
            <Link href="/contact" className="btn btn-primary" style={{ marginTop: '25px', display: 'inline-block' }}>
              {t.home.meetTeam}
            </Link>
          </div>
        </div>
      </section>

      <section className="difference">
        <h2>{t.sections.way2PetsDifference}</h2>
        <div className="diff-grid">
          <div className="diff-card">
            <h3>{t.home.noCagesTitle}</h3>
            <p>{t.home.noCagesText}</p>
          </div>
          <div className="diff-card">
            <h3>{t.home.realFoodTitle}</h3>
            <p>{t.home.realFoodText}</p>
          </div>
          <div className="diff-card">
            <h3>{t.home.trustTitle}</h3>
            <p>{t.home.trustText}</p>
          </div>
        </div>
      </section>

      <section className="services">
        <h2>{t.sections.whatWeOffer}</h2>
        <div className="services-grid">
          <div className="service-card">
            <Image
              src="https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt={t.home.boardingAlt}
              width={800}
              height={520}
            />
            <div className="service-content">
              <h3>{t.features.cageFreeBoarding}</h3>
              <p>{t.home.boardingText}</p>
              <Link href="/boarding" className="btn btn-secondary" style={{ marginTop: 'auto' }}>
                {t.home.bookNow}
              </Link>
            </div>
          </div>
          <div className="service-card">
            <Image
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt={t.home.findPetAlt}
              width={800}
              height={520}
            />
            <div className="service-content">
              <h3>{t.home.findPetTitle}</h3>
              <p>{t.home.findPetText}</p>
              <Link href="/find-a-pet" className="btn btn-secondary" style={{ marginTop: 'auto' }}>
                {t.home.browsePets}
              </Link>
            </div>
          </div>
          <div className="service-card">
            <Image
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt={t.home.naturalPetFoodAlt}
              width={800}
              height={520}
            />
            <div className="service-content">
              <h3>{t.home.naturalPetFood}</h3>
              <p>{t.home.naturalPetFoodText}</p>
              <Link href="/contact" className="btn btn-secondary" style={{ marginTop: 'auto' }}>
                {t.home.enquireNow}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="reviews">
        <h2>{t.sections.petParentsSay}</h2>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div className="review-card" key={review.id || review.reviewer_name}>
              <p>&ldquo;{review.review_text}&rdquo;</p>
              <div className="stars">{'★'.repeat(review.rating || 5)}</div>
              <div className="reviewer">- <span style={{ fontWeight: 600 }}>{review.reviewer_name}</span></div>
            </div>
          ))}
        </div>
        <Link href="/reviews" className="btn btn-primary" style={{ marginTop: '40px', display: 'inline-block' }}>
          {t.home.readAllReviews}
        </Link>
      </section>

      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <div>
              <h3>{t.sections.visitUs}</h3>
              <p>{t.home.visitText}</p>
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>1/673, Vishal Khand 1, Gomti Nagar, Lucknow, UP 226010</span>
              </div>
              <div className="info-item">
                <i className="fas fa-phone-alt"></i>
                <span>+91 73761 26261</span>
              </div>
              <div className="info-item">
                <i className="fas fa-envelope"></i>
                <span>care@way2pets.com</span>
              </div>
              <div className="info-item">
                <i className="fas fa-clock"></i>
                <span>{t.home.hours}</span>
              </div>
            </div>
          </div>
          <div className="contact-form-wrapper">
            <h3>{t.sections.sendMessage}</h3>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
