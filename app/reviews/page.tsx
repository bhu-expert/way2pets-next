import type { Metadata } from 'next'
import Hero from '@/components/Hero'

export const metadata: Metadata = {
  title: 'Customer Reviews & Testimonials | Way2Pets Lucknow',
  description: 'Read what our happy customers say about Way2Pets. 5-star reviews for dog boarding, puppy adoption, and pet care advice in Lucknow.',
}

const reviews = [
  { text: 'Owner and the staff is very gentle, and the quality of puppy is best, my experience is very good and the last thing is Mam is too kind and sweet.', name: 'Rupesh Rajput Rajput', time: '1 month ago' },
  { text: 'An amazing place like home for your dogs. I always fall back on way2pets if i ever need anything for my pets. Thank you', name: 'Ramita', time: '10 months ago' },
  { text: 'Best pet shop in lucknow. I got a golden retriever puppy from them who is very healthy and a lovely baby. Bhaiya there is very kind and supportive whenever I need any guidance over the call.', name: 'Advocate Manvi Raj', time: '1 year ago' },
  { text: 'After years of searching for a trustworthy pet boarding facility, we finally found Way2Pets... We were thrilled to receive regular updates from Ms. Nidhi, who demonstrated exceptional care... highly recommend.', name: 'Ashok Mohan Saxena', time: '1 year ago' },
  { text: 'Your dedication to ensuring the health and well-being of the puppies is truly commendable... Thank you for giving us such a cute Puppy.', name: 'Rimsha Mishra', time: '1 year ago' },
  { text: 'Great place for your pet. Left our GSD for 2 days. Ashish is very nice person. He has in-depth knowledge about dogs and takes care of your pets like his own.', name: 'Varun Garg', time: '1 year ago' },
  { text: 'I researched a lot before purchasing my pet... Initially I was afraid to buy but when I spoke to shop owner and his dedication for animals, my hesitation turned into trust.', name: 'Abhishek Singh', time: '3 years ago' },
  { text: 'I got a beagle from here. It is very good quality and with markings. Also my other dog stays in their crutch and had never faced any problem.', name: 'Renu Singh', time: '3 years ago' },
  { text: 'It is a very nice and responsive pet shop. They give instructions very well and also help if you have an issue. I bought my Labrador joy from them in very reliable price.', name: "Drishti's vlogs", time: '4 years ago' },
  { text: 'We got our golden retriever female from them. They are not just regular breeders...they care for each dog they breed and love them.', name: 'Rhea Katiyar', time: '4 years ago' },
  { text: 'A perfect place to buy pet related products.', name: 'DEEPAK', time: '23 Oct 2018' },
  { text: 'My dog had cist and recovered within 1 month with homeopathic medicine suggested by Ashish Bhai. Thanks to him.', name: 'Jyoti', time: '15 Oct 2018' },
  { text: 'I had a great experience in your store. My pet gets each and every required and necessary service here.', name: 'Sanchi Batra', time: '9 Oct 2018' },
  { text: 'If you are looking for a home away from home for your pet you must visit this place. It offers great affordable products at reasonable prices apart from a lot of care and love.', name: 'Aditi', time: '8 Oct 2018' },
  { text: 'Best place..I bought my pet Koko from there.. And I always buy everything from there.. Best part they always pic my phone on my lil queries too..', name: 'Divya', time: '8 Oct 2018' },
  { text: 'The best pet help centre which runs not only on money but on feelings too..i call it help centre because they not only sell wide range of quality pet care products but help animals also..even strays', name: 'Swarn', time: '8 Oct 2018' },
]

export default function ReviewsPage() {
  return (
    <>
      <Hero
        title="Customer Love"
        subtitle="Don't just take our word for it. Here is what pet parents in Lucknow have to say."
        imageUrl="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
        minHeight="40vh"
      />

      <div style={{ background: 'white', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '50px', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: '2rem', margin: 0, color: '#333' }}>4.2<span style={{ fontSize: '1rem', color: '#777' }}>/5</span></h3>
            <p style={{ margin: '5px 0 0', color: '#666' }}>Google Rating</p>
            <div style={{ color: '#f4b400' }}>★★★★☆</div>
          </div>
          <div>
            <span style={{ background: '#ff7e00', color: 'white', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold' }}>jd</span>
            <h3 style={{ fontSize: '2rem', margin: '10px 0 0', color: '#333' }}>4.3<span style={{ fontSize: '1rem', color: '#777' }}>/5</span></h3>
            <p style={{ margin: '5px 0 0', color: '#666' }}>Justdial Rating</p>
            <div style={{ color: '#ff7e00' }}>★★★★☆</div>
          </div>
        </div>
      </div>

      <section className="reviews" style={{ background: 'var(--light-green)' }}>
        <div className="reviews-grid">
          {reviews.map((r) => (
            <div key={r.name} className="review-card">
              <div className="stars">★★★★★</div>
              <p>&ldquo;{r.text}&rdquo;</p>
              <div className="reviewer">- <strong>{r.name}</strong><br /><small>{r.time}</small></div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
