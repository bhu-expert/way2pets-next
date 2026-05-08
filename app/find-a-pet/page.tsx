import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import FindPetForm from '@/components/FindPetForm'

export const metadata: Metadata = {
  title: 'Adopt Puppy Kitten Lucknow | Way2Pets',
  description: 'Find your perfect furry friend. Adopt puppy, kitten, or dog in Lucknow. We have many rescued pets waiting for a forever home. Visit Way2Pets today.',
}

export default function FindAPetPage() {
  return (
    <>
      <Hero
        title="Find Your Best Friend"
        subtitle="Discover happy, healthy puppies and kittens waiting to become part of your family."
        imageUrl="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        minHeight="60vh"
      />

      <section className="services" style={{ background: 'var(--light-green)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '40px', padding: '0 20px' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2>Why Choose Way2Pets?</h2>
            <ul style={{ marginTop: '20px', listStyle: 'disc', paddingLeft: '20px' }}>
              {[
                'Healthy puppies and kittens',
                'Breed-specific diet and care guidance',
                'Grooming and trait insights shared upfront',
                'Socialized for easy adjustment',
                'Lifetime support and guidance',
              ].map((item) => (
                <li key={item} style={{ marginBottom: '10px' }}>{item}</li>
              ))}
            </ul>
          </div>
          <div style={{ flex: 1, minWidth: '300px', background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <h3>Find Your Match</h3>
            <FindPetForm />
          </div>
        </div>
      </section>

      <section className="reviews">
        <h2>Happy Pet Parents</h2>
        <div className="reviews-grid">
          <div className="review-card">
            <p>&ldquo;We adopted a Husky mix from Way2Pets. Ashish sir helped us understand the breed&apos;s needs. He&apos;s doing great!&rdquo;</p>
            <div className="stars">★★★★★</div>
            <div className="reviewer">- <span style={{ fontWeight: 600 }}>Sanjay V.</span></div>
          </div>
          <div className="review-card">
            <p>&ldquo;Found the cutest kitten here. Healthy and playful. Thanks for the guidance on raw feeding.&rdquo;</p>
            <div className="stars">★★★★★</div>
            <div className="reviewer">- <span style={{ fontWeight: 600 }}>Meera L.</span></div>
          </div>
          <div className="review-card">
            <p>&ldquo;Brought home a Golden Retriever puppy last month. The guidance on diet and initial training was invaluable.&rdquo;</p>
            <div className="stars">★★★★★</div>
            <div className="reviewer">- <span style={{ fontWeight: 600 }}>Rajesh K.</span></div>
          </div>
          <div className="review-card">
            <p>&ldquo;The best experience getting our Shih Tzu. Handover was detailed and the puppy was clean and healthy. Highly recommend Way2Pets.&rdquo;</p>
            <div className="stars">★★★★★</div>
            <div className="reviewer">- <span style={{ fontWeight: 600 }}>Anjali S.</span></div>
          </div>
        </div>
      </section>
    </>
  )
}
