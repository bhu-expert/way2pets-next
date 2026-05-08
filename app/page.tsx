import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from '@/components/Hero'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Way2Pets Lucknow | Natural Pet Care, Boarding & Adoption',
  description: "Way2Pets is Lucknow's trusted pet shop for natural dog food, cage-free boarding, puppy adoption, and holistic pet care.",
}

export default function HomePage() {
  return (
    <>
      <Hero
        title="Lucknow's Natural Pet Care Experts"
        subtitle="Natural food. Cage-free boarding. Ethical adoption. Because your pet deserves the best."
        imageUrl="https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        minHeight="100vh"
      />

      {/* Features Bar */}
      <section className="features">
        <div className="features-container">
          <div className="feature-item">
            <i className="fas fa-seedling"></i>
            <div><strong>Natural Food</strong><br /><small>No processed kibble</small></div>
          </div>
          <div className="feature-item">
            <i className="fas fa-home"></i>
            <div><strong>Cage-Free Boarding</strong><br /><small>Home-like stay</small></div>
          </div>
          <div className="feature-item">
            <i className="fas fa-heart"></i>
            <div><strong>Ethical Adoption</strong><br /><small>Happy, healthy pets</small></div>
          </div>
          <div className="feature-item">
            <i className="fas fa-user-md"></i>
            <div><strong>Holistic Care</strong><br /><small>Homeopathy & wellness</small></div>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section style={{ padding: 'var(--section-padding)', background: 'var(--white)' }}>
        <div className="founder">
          <div className="founder-img">
            <img
              src="https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Ashish - Founder of Way2Pets"
            />
          </div>
          <div className="founder-text">
            <h2>Our Story: <span className="highlight">From Passion to Purpose</span></h2>
            <p>Way2Pets was founded by <strong>Ashish</strong>, a lifelong animal lover who was frustrated by the lack of honest, natural pet care options in Lucknow.</p>
            <p style={{ margin: '15px 0' }}>After years of researching dog nutrition and holistic health, he started Way2Pets with a simple mission: to give every pet the life they deserve — free from cages, processed food, and harmful chemicals.</p>
            <p>Today, Way2Pets is trusted by hundreds of pet families across Lucknow for boarding, adoption, and natural food guidance.</p>
            <Link href="/contact" className="btn btn-primary" style={{ marginTop: '25px', display: 'inline-block' }}>
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* The Difference */}
      <section className="difference">
        <h2>The Way2Pets Difference</h2>
        <div className="diff-grid">
          <div className="diff-card">
            <h3>No Cages. Ever.</h3>
            <p>Our boarding facility is 100% cage-free. Dogs sleep on beds and sofas, play freely, and are treated like family members.</p>
          </div>
          <div className="diff-card">
            <h3>Real Food, Real Health</h3>
            <p>We feed pets fresh meat, eggs, and vegetables — the diet they evolved to eat. No preservatives, no fillers.</p>
          </div>
          <div className="diff-card">
            <h3>Knowledge You Can Trust</h3>
            <p>Our founder has 15+ years of hands-on experience with dog behavior, nutrition, and holistic healing. We don't just sell — we educate.</p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services">
        <h2>What We Offer</h2>
        <div className="services-grid">
          <div className="service-card">
            <img
              src="https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Dog Boarding"
            />
            <div className="service-content">
              <h3>Cage-Free Boarding</h3>
              <p>Leave your dog with us while you travel. Daily videos, natural food, playtime, and a real home environment.</p>
              <Link href="/boarding" className="btn btn-secondary" style={{ marginTop: 'auto' }}>
                Book Now
              </Link>
            </div>
          </div>
          <div className="service-card">
            <img
              src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Find a Pet"
            />
            <div className="service-content">
              <h3>Find Your Pet</h3>
              <p>Adopt a healthy, socialized puppy or kitten. Breed guidance, diet plans, and lifetime support included.</p>
              <Link href="/find-a-pet" className="btn btn-secondary" style={{ marginTop: 'auto' }}>
                Browse Pets
              </Link>
            </div>
          </div>
          <div className="service-card">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Natural Pet Food"
            />
            <div className="service-content">
              <h3>Natural Pet Food</h3>
              <p>Fresh, species-appropriate food for dogs and cats. Made with real ingredients and zero preservatives.</p>
              <Link href="/contact" className="btn btn-secondary" style={{ marginTop: 'auto' }}>
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Snippet */}
      <section className="reviews">
        <h2>What Pet Parents Say</h2>
        <div className="reviews-grid">
          <div className="review-card">
            <p>&ldquo;Best pet shop in Lucknow. I got a golden retriever puppy who is very healthy and lovely.&rdquo;</p>
            <div className="stars">★★★★★</div>
            <div className="reviewer">- <span style={{ fontWeight: 600 }}>Advocate Manvi Raj</span></div>
          </div>
          <div className="review-card">
            <p>&ldquo;An amazing place like home for your dogs. I always fall back on Way2Pets if I ever need anything.&rdquo;</p>
            <div className="stars">★★★★★</div>
            <div className="reviewer">- <span style={{ fontWeight: 600 }}>Ramita</span></div>
          </div>
          <div className="review-card">
            <p>&ldquo;Ashish is very nice. He has in-depth knowledge about dogs and takes care of your pets like his own.&rdquo;</p>
            <div className="stars">★★★★★</div>
            <div className="reviewer">- <span style={{ fontWeight: 600 }}>Varun Garg</span></div>
          </div>
        </div>
        <Link href="/reviews" className="btn btn-primary" style={{ marginTop: '40px', display: 'inline-block' }}>
          Read All Reviews
        </Link>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <div>
              <h3>Visit Us</h3>
              <p>Experience the difference in pet care.</p>
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
                <span>Mon–Sun: 10:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>
          <div className="contact-form-wrapper">
            <h3>Send Us a Message</h3>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
