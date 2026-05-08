import type { Metadata } from 'next'
import Image from 'next/image'
import Hero from '@/components/Hero'
import BoardingForm from '@/components/BoardingForm'

export const metadata: Metadata = {
  title: 'Pet Boarding Lucknow | Dog Hostel | Way2Pets',
  description: 'Best cage-free dog boarding in Lucknow. Way2Pets offers a home-like environment, natural food, and holistic care. Book your pet\'s stay today.',
}

export default function BoardingPage() {
  return (
    <>
      <Hero
        title="Cage-Free Dog Boarding"
        subtitle="A home away from home. No cages, just love, play, and natural food."
        imageUrl="https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        minHeight="50vh"
      />

      <section className="features">
        <div className="features-container">
          <div className="feature-item">
            <i className="fas fa-home"></i>
            <div><strong>Home Environment</strong><br /><small>Sleep on beds/sofas</small></div>
          </div>
          <div className="feature-item">
            <i className="fas fa-video"></i>
            <div><strong>Daily Updates</strong><br /><small>Videos &amp; Photos sent</small></div>
          </div>
          <div className="feature-item">
            <i className="fas fa-user-md"></i>
            <div><strong>Vet on Call</strong><br /><small>24/7 Medical support</small></div>
          </div>
        </div>
      </section>

      <section className="services" style={{ background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '50px', flexWrap: 'wrap', padding: '0 20px' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 style={{ textAlign: 'left' }}>Book a Stay</h2>
            <p style={{ marginBottom: '20px' }}>Planning a vacation? Leave your pet with the experts.</p>
            <BoardingForm />
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 style={{ textAlign: 'left' }}>Daily Schedule</h2>
            <ul style={{ marginTop: '20px' }}>
              {[
                { time: '7:00 AM', activity: 'Morning Walk & Potty', color: 'var(--primary-green)' },
                { time: '9:00 AM', activity: 'Natural Breakfast (Eggs/Meat/Veggies)', color: 'var(--accent-orange)' },
                { time: '12:00 PM', activity: 'Nap Time / Relaxation', color: 'var(--primary-green)' },
                { time: '5:00 PM', activity: 'Play Time & Socialization', color: 'var(--accent-orange)' },
                { time: '8:00 PM', activity: 'Dinner & Sleep', color: 'var(--primary-green)' },
              ].map(({ time, activity, color }) => (
                <li key={time} style={{ marginBottom: '20px', borderLeft: `3px solid ${color}`, paddingLeft: '15px' }}>
                  <strong>{time}</strong> - {activity}
                </li>
              ))}
            </ul>
            <Image
              src="https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Happy dog during home-style boarding in Lucknow"
              width={800}
              height={520}
              style={{ marginTop: '20px' }}
            />
          </div>
        </div>
      </section>

      <section className="reviews">
        <h2>Boarding Reviews</h2>
        <div className="reviews-grid">
          <div className="review-card">
            <p>&ldquo;I was worried about leaving my Beagle, but seeing the daily videos of him playing made me relax. This is the best dog hostel in Lucknow.&rdquo;</p>
            <div className="stars">★★★★★</div>
            <div className="reviewer">- <span style={{ fontWeight: 600 }}>Vikram S.</span></div>
          </div>
          <div className="review-card">
            <p>&ldquo;They handled my aggressive Rottweiler so well. By the time I picked him up, he was calmer. Ashish sir knows dog behavior inside out.&rdquo;</p>
            <div className="stars">★★★★★</div>
            <div className="reviewer">- <span style={{ fontWeight: 600 }}>Amit Singh</span></div>
          </div>
        </div>
      </section>
    </>
  )
}
