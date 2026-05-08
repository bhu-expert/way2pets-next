import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="seo-hero">
      <div>
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The page may have moved. Explore Way2Pets boarding, pet listings, gallery or contact pages.</p>
        <div className="seo-cta-row">
          <Link className="btn btn-primary" href="/pet-boarding-for-cat-and-dog-in-lucknow">Pet Boarding</Link>
          <Link className="btn btn-secondary" href="/contact">Contact Us</Link>
        </div>
      </div>
    </section>
  )
}
