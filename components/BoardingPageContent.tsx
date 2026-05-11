'use client'

import Image from 'next/image'
import Hero from '@/components/Hero'
import BoardingForm from '@/components/BoardingForm'
import { useI18n } from '@/src/i18n'

export default function BoardingPageContent() {
  const { t } = useI18n()

  return (
    <>
      <Hero title={t.boarding.heroTitle} subtitle={t.boarding.heroSubtitle} imageUrl="https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" minHeight="50vh" />
      <section className="features">
        <div className="features-container">
          <div className="feature-item"><i className="fas fa-home"></i><div><strong>{t.boarding.homeEnvironment}</strong><br /><small>{t.boarding.bedsSofas}</small></div></div>
          <div className="feature-item"><i className="fas fa-video"></i><div><strong>{t.boarding.dailyUpdates}</strong><br /><small>{t.boarding.photosSent}</small></div></div>
          <div className="feature-item"><i className="fas fa-user-md"></i><div><strong>{t.boarding.vetOnCall}</strong><br /><small>{t.boarding.medicalSupport}</small></div></div>
        </div>
      </section>
      <section className="services" style={{ background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '50px', flexWrap: 'wrap', padding: '0 20px' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 style={{ textAlign: 'left' }}>{t.boarding.bookStay}</h2>
            <p style={{ marginBottom: '20px' }}>{t.boarding.bookIntro}</p>
            <BoardingForm />
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 style={{ textAlign: 'left' }}>{t.boarding.dailySchedule}</h2>
            <ul style={{ marginTop: '20px' }}>
              {t.boarding.schedule.map(({ time, activity }, index) => (
                <li key={time} style={{ marginBottom: '20px', borderLeft: `3px solid ${index % 2 ? 'var(--accent-orange)' : 'var(--primary-green)'}`, paddingLeft: '15px' }}>
                  <strong>{time}</strong> - {activity}
                </li>
              ))}
            </ul>
            <Image src="https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt={t.boarding.imageAlt} width={800} height={520} style={{ marginTop: '20px' }} />
          </div>
        </div>
      </section>
      <section className="reviews">
        <h2>{t.boarding.reviewsTitle}</h2>
        <div className="reviews-grid">
          {t.boarding.reviews.map((review) => (
            <div className="review-card" key={review.name}>
              <p>&ldquo;{review.text}&rdquo;</p><div className="stars">★★★★★</div><div className="reviewer">- <span style={{ fontWeight: 600 }}>{review.name}</span></div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
